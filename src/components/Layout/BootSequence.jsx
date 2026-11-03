import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { prefersReducedMotion } from '../../lib/typewriter';
import { tools } from './toolRegistry';

const STORAGE_KEY = 'mc-boot-seen';
const STEP_MS = 150;

const LINES = [
  ['INIT core.format', 'OK'],
  ['MOUNT sandbox.iframe', 'OK'],
  ['LINK network.uplink', 'DISABLED'],
  [`LOAD instruments [${String(tools.length).padStart(2, '0')}]`, 'OK'],
];

function shouldBoot() {
  if (typeof window === 'undefined' || prefersReducedMotion()) return false;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) !== '1';
  } catch {
    // Storage blocked (private mode etc.): skip rather than replay every load.
    return false;
  }
}

/**
 * One-time-per-session intro overlay. Purely decorative (aria-hidden), about
 * one second long, and any key press or click dismisses it immediately.
 * Never shown when the user prefers reduced motion.
 */
export default function BootSequence() {
  const [visible, setVisible] = useState(shouldBoot);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!visible) return undefined;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    const id = setInterval(() => setStep((s) => s + 1), STEP_MS);
    const skip = () => setVisible(false);
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      clearInterval(id);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [visible]);

  useEffect(() => {
    // lines… headline… one beat to read it… done
    if (step > LINES.length + 3) setVisible(false);
  }, [step]);

  if (!visible) return null;

  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: (t) => t.zIndex.modal + 10,
        bgcolor: 'background.default',
        backgroundImage: (t) =>
          `linear-gradient(${t.palette.tokens.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.palette.tokens.grid} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 0.75,
        px: { xs: 3, sm: 8 },
        cursor: 'pointer',
      }}
    >
      {LINES.slice(0, step).map(([label, status]) => (
        <Typography key={label} variant="caption" sx={{ fontSize: '0.85rem', color: 'text.secondary', display: 'flex', gap: 1 }}>
          <span>{label}</span>
          <Box component="span" sx={{ flex: '0 1 220px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {' ................................................'}
          </Box>
          <Box component="span" sx={{ color: status === 'OK' ? 'success.main' : 'secondary.main', fontWeight: 500 }}>
            {status}
          </Box>
        </Typography>
      ))}
      {step > LINES.length && (
        <Typography variant="h1" component="p" sx={{ fontSize: { xs: '2.6rem', sm: '4rem' }, mt: 2 }}>
          All systems{' '}
          <Box component="span" sx={{ color: 'secondary.main' }}>
            nominal
          </Box>
        </Typography>
      )}
      <Typography variant="caption" sx={{ position: 'absolute', bottom: 24, color: 'text.secondary' }}>
        Press any key to skip
      </Typography>
    </Box>
  );
}
