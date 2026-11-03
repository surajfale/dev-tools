import { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { tools } from '../components/Layout/toolRegistry';
import OrbitRings from '../components/Common/OrbitRings';
import { bracketBackground } from '../theme';
import { prefersReducedMotion } from '../lib/typewriter';

const facts = [
  { k: 'Tools', v: tools.length },
  { k: 'Servers', v: 0 },
  { k: 'Uploads', v: 0 },
  { k: 'Trackers', v: 0 },
];

const pad = (n) => String(n).padStart(2, '0');

/** Instrument-style readout: digits scramble briefly, then settle on the value. */
function Readout({ value }) {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return undefined;
    }
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      if (step >= 14) {
        clearInterval(id);
        setDisplay(value);
      } else {
        setDisplay(Math.floor(Math.random() * 99));
      }
    }, 45);
    return () => clearInterval(id);
  }, [value]);

  return <>{pad(display)}</>;
}

export default function Dashboard() {
  return (
    <Box>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) auto' },
          gap: 4,
          alignItems: 'center',
          mb: { xs: 5, md: 7 },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary" component="p" sx={{ mb: 2 }}>
            Console / Vol. 02 — tools for the unglamorous parts of the job
          </Typography>

          <Typography variant="h1" sx={{ fontSize: { xs: '3.2rem', sm: '5rem', xl: '6.5rem' }, mb: 3 }}>
            Format. Convert.
            <br />
            <Box component="span" sx={{ color: 'secondary.main' }}>
              All systems nominal.
            </Box>
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.05rem', maxWidth: '58ch', color: 'text.secondary', mb: 3 }}>
            Paste the payload, get back something you would put in a PR. Every tool runs in your browser, so nothing
            leaves this machine.
          </Typography>

          <Box
            component="dl"
            aria-label="System readout"
            sx={{
              display: 'inline-grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, auto)' },
              gap: '1px',
              m: 0,
              border: 1,
              borderColor: 'tokens.rule',
              bgcolor: 'tokens.rule',
            }}
          >
            {facts.map((f) => (
              <Box key={f.k} sx={{ px: 2, py: 1, bgcolor: 'background.paper', minWidth: 96 }}>
                <Typography component="dt" variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  {f.k}
                </Typography>
                <Typography component="dd" variant="h5" sx={{ m: 0, fontSize: '1.6rem', lineHeight: 1.15 }}>
                  <Readout value={f.v} />
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <OrbitRings size={280} sx={{ display: { xs: 'none', lg: 'block' }, mr: 2 }} />
      </Box>

      {/* ── Instruments ──────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6" component="h2">
          Instruments
        </Typography>
        <Box aria-hidden sx={{ flex: 1, borderTop: 1, borderColor: 'tokens.rule' }} />
        <Typography variant="caption" color="text.secondary">
          {pad(tools.length)} ENTRIES
        </Typography>
      </Box>

      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          p: 0,
          m: 0,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 1.5,
        }}
      >
        {tools.map(({ code, tag, title, description, path, Icon }, idx) => (
          <Box
            component="li"
            key={path}
            sx={{
              // Feature tiles span two columns so 7 entries tile with no gaps:
              // sm (2 cols): 2+1·6 = 8 cells; lg (3 cols): 2+1·5+2 = 9 cells.
              gridColumn: {
                sm: idx === 0 ? 'span 2' : 'auto',
                lg: idx === 0 || idx === tools.length - 1 ? 'span 2' : 'auto',
              },
            }}
          >
            <Box
              component={RouterLink}
              to={path}
              aria-label={`Open ${title}`}
              sx={(theme) => {
                const t = theme.palette.tokens;
                return {
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  minHeight: { xs: 180, md: 210 },
                  p: { xs: 2.5, md: 3 },
                  color: 'text.primary',
                  textDecoration: 'none',
                  border: 1,
                  borderColor: 'divider',
                  background: bracketBackground(t.accentText, t.paper, 10),
                  transition: 'border-color 150ms, background 150ms',
                  '&:hover, &:focus-visible': {
                    borderColor: t.accentText,
                    background: bracketBackground(t.accentText, t.paper, 22),
                    '& .tile-code::before': { content: '"▸ "' },
                    '& .tile-go': { transform: 'translateX(4px)', color: 'secondary.main' },
                  },
                };
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 'auto' }}>
                <Typography className="tile-code" variant="caption" sx={{ color: 'secondary.main', letterSpacing: '0.08em' }}>
                  T/{code} · {tag}
                </Typography>
                <Icon aria-hidden sx={{ fontSize: 20, color: 'text.secondary' }} />
              </Box>

              <Typography
                variant="h3"
                component="h3"
                sx={{ mt: 4, mb: 1, fontSize: { xs: '1.9rem', md: idx === 0 ? '2.8rem' : '2.1rem' }, textTransform: 'uppercase', lineHeight: 0.95 }}
              >
                {title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                  {description}
                </Typography>
                <Typography
                  className="tile-go"
                  aria-hidden
                  variant="caption"
                  sx={{ color: 'text.secondary', transition: 'transform 150ms, color 150ms', whiteSpace: 'nowrap' }}
                >
                  OPEN →
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
