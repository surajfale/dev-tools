import { Alert, AlertTitle } from '@mui/material';

export default function ErrorAlert({ error, title = 'Error' }) {
  if (!error) return null;

  return (
    <Alert severity="error" sx={{ mt: 2 }} role="alert">
      <AlertTitle>{title}</AlertTitle>
      {error}
    </Alert>
  );
}