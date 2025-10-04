/**
 * Upload HTML to free pastebin services and get shareable links
 */

/**
 * Upload to dpaste.com (Simple, reliable, 7 days expiration)
 */
const uploadToDpaste = async (html) => {
  try {
    const formData = new FormData();
    formData.append('content', html);
    formData.append('syntax', 'html');
    formData.append('expiry_days', '7'); // 7 days expiration

    const response = await fetch('https://dpaste.com/api/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('dpaste upload failed');

    const url = await response.text();
    return {
      success: true,
      url: url.trim(),
      viewUrl: url.trim() + '.txt', // Raw HTML view
      service: 'dpaste.com',
      expiration: '7 days'
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Upload to paste.ee (No expiration, clean URLs)
 */
const uploadToPasteEe = async (html) => {
  try {
    const response = await fetch('https://api.paste.ee/v1/pastes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sections: [
          {
            contents: html,
          }
        ]
      }),
    });

    if (!response.ok) throw new Error('paste.ee upload failed');

    const data = await response.json();
    const pasteId = data.id;

    return {
      success: true,
      url: `https://paste.ee/p/${pasteId}`,
      viewUrl: `https://paste.ee/r/${pasteId}`, // Raw view
      service: 'paste.ee',
      expiration: 'permanent'
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Upload to pastebin.com alternative - rentry.co
 */
const uploadToRentry = async (html) => {
  try {
    const formData = new FormData();
    formData.append('text', html);

    const response = await fetch('https://rentry.co/api/new', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('rentry upload failed');

    const data = await response.json();

    return {
      success: true,
      url: data.url,
      viewUrl: data.url + '/raw',
      service: 'rentry.co',
      expiration: 'permanent'
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Main upload function - tries multiple services with fallback
 */
export const uploadHtmlToCloud = async (html) => {
  // Try services in order of preference (dpaste first - has auto-deletion)
  const services = [
    { name: 'dpaste', fn: uploadToDpaste }, // 7 days expiration
    { name: 'paste.ee', fn: uploadToPasteEe }, // Permanent (fallback)
    { name: 'rentry', fn: uploadToRentry }, // Permanent (fallback)
  ];

  for (const service of services) {
    try {
      const result = await service.fn(html);
      if (result.success) {
        return result;
      }
    } catch (error) {
      console.warn(`Failed to upload to ${service.name}:`, error);
      continue;
    }
  }

  // All services failed
  return {
    success: false,
    error: 'All upload services failed. Please try again later or use the Download button to save the HTML file.'
  };
};

/**
 * Fetch HTML from a raw URL with CORS handling
 */
export const fetchHtmlFromUrl = async (url) => {
  try {
    // Try direct fetch first
    let response = await fetch(url, {
      mode: 'cors',
      headers: {
        'Accept': 'text/plain, text/html, */*'
      }
    });

    // If blocked by CORS or rate limited, try CORS proxy
    if (!response.ok) {
      console.warn(`Direct fetch failed (${response.status}), trying CORS proxy...`);

      // Use allOrigins CORS proxy
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      response = await fetch(proxyUrl);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return { success: true, html };
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      success: false,
      error: `Failed to load content: ${error.message}. The link may have expired or the service may be temporarily unavailable.`
    };
  }
};
