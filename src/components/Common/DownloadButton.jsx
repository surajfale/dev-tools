import { Button } from '@mui/material';
import { Download } from '@mui/icons-material';

export default function DownloadButton({ 
  text, 
  filename = 'download.txt', 
  disabled = false, 
  size = 'small' 
}) {
  const handleDownload = () => {
    if (!text) return;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={disabled || !text}
      startIcon={<Download />}
      size={size}
      variant="outlined"
      aria-label={`Download as ${filename}`}
    >
      Download
    </Button>
  );
}