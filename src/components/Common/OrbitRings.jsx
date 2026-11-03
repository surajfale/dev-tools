import { Box } from '@mui/material';

/**
 * Decorative orbital diagram: three concentric rings with two bodies orbiting
 * at different speeds. Purely visual (aria-hidden). Under
 * prefers-reduced-motion the global theme rule freezes the animation, so the
 * bodies simply rest at the top of their orbits.
 */
export default function OrbitRings({ size = 280, sx }) {
  const inner = size * 0.18;
  const mid = size * 0.37;

  const ring = (inset, extra = {}) => ({
    position: 'absolute',
    inset,
    borderRadius: '50%',
    border: 1,
    borderColor: 'tokens.rule',
    ...extra,
  });

  const arm = (inset, duration, reverse = false) => ({
    position: 'absolute',
    inset,
    animation: `mc-spin ${duration}s linear infinite`,
    animationDirection: reverse ? 'reverse' : 'normal',
  });

  const body = (dot, color) => ({
    position: 'absolute',
    top: -dot / 2,
    left: '50%',
    width: dot,
    height: dot,
    ml: `${-dot / 2}px`,
    borderRadius: '50%',
    bgcolor: color,
  });

  return (
    <Box aria-hidden sx={{ position: 'relative', width: size, height: size, flexShrink: 0, ...sx }}>
      <Box sx={ring(0)} />
      <Box sx={ring(inner, { borderStyle: 'dashed' })} />
      <Box sx={ring(mid, { borderColor: 'text.primary', opacity: 0.5 })} />
      {/* crosshair ticks */}
      <Box sx={{ position: 'absolute', left: '50%', top: -8, height: 16, borderLeft: 1, borderColor: 'tokens.rule' }} />
      <Box sx={{ position: 'absolute', left: '50%', bottom: -8, height: 16, borderLeft: 1, borderColor: 'tokens.rule' }} />
      <Box sx={{ position: 'absolute', top: '50%', left: -8, width: 16, borderTop: 1, borderColor: 'tokens.rule' }} />
      <Box sx={{ position: 'absolute', top: '50%', right: -8, width: 16, borderTop: 1, borderColor: 'tokens.rule' }} />

      <Box sx={arm(0, 32)}>
        <Box sx={{ ...body(9, 'accent.main'), boxShadow: (t) => `0 0 0 4px ${t.palette.tokens.ruleSoft}` }} />
      </Box>
      <Box sx={arm(inner, 18, true)}>
        <Box sx={body(6, 'success.main')} />
      </Box>

      <Box
        component="span"
        sx={{
          position: 'absolute',
          right: 0,
          bottom: -28,
          typography: 'caption',
          fontSize: '0.62rem',
          color: 'text.secondary',
          letterSpacing: '0.1em',
        }}
      >
        AZ 042° · EL 17°
      </Box>
    </Box>
  );
}
