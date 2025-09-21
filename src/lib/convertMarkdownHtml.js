import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const convertMarkdownToHtml = (markdown) => {
  try {
    if (!markdown.trim()) {
      return { success: false, error: 'Input is empty' };
    }

    const html = marked(markdown);
    const sanitizedHtml = DOMPurify.sanitize(html);
    
    return { success: true, result: sanitizedHtml };
  } catch (error) {
    return { 
      success: false, 
      error: `Markdown conversion error: ${error.message}` 
    };
  }
};

export const convertHtmlToMarkdown = (html) => {
  try {
    if (!html.trim()) {
      return { success: false, error: 'Input is empty' };
    }

    // Basic HTML to Markdown conversion
    let markdown = html;
    
    // Headers
    markdown = markdown.replace(/<h([1-6])>(.*?)<\/h[1-6]>/g, (match, level, text) => {
      return '#'.repeat(parseInt(level)) + ' ' + text.trim() + '\n\n';
    });
    
    // Bold and italic
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    markdown = markdown.replace(/<b>(.*?)<\/b>/g, '**$1**');
    markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
    markdown = markdown.replace(/<i>(.*?)<\/i>/g, '*$1*');
    
    // Code blocks and inline code
    markdown = markdown.replace(/<pre><code>(.*?)<\/code><\/pre>/gs, '```\n$1\n```\n');
    markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');
    
    // Links
    markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');
    
    // Images
    markdown = markdown.replace(/<img src="(.*?)" alt="(.*?)".*?>/g, '![$2]($1)');
    
    // Lists
    markdown = markdown.replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
      return content.replace(/<li>(.*?)<\/li>/g, '- $1\n') + '\n';
    });
    
    markdown = markdown.replace(/<ol>(.*?)<\/ol>/gs, (match, content) => {
      let counter = 1;
      return content.replace(/<li>(.*?)<\/li>/g, () => `${counter++}. $1\n`) + '\n';
    });
    
    // Paragraphs
    markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
    
    // Line breaks
    markdown = markdown.replace(/<br\s*\/?>/g, '\n');
    
    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '');
    
    // Clean up extra whitespace
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();
    
    return { success: true, result: markdown };
  } catch (error) {
    return { 
      success: false, 
      error: `HTML conversion error: ${error.message}` 
    };
  }
};