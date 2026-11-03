import { Button } from '@mui/material';
import { ScienceOutlined } from '@mui/icons-material';

export default function SampleInputButton({ onLoadSample, size = 'small' }) {
  return (
    <Button
      onClick={onLoadSample}
      startIcon={<ScienceOutlined />}
      size={size}
      variant="outlined"
      color="secondary"
      aria-label="Load sample input"
    >
      Sample
    </Button>
  );
}