import { Typography, Box } from '@mui/material';
import { ArrowOutward } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { tools } from '../components/Layout/toolRegistry';

const facts = [
  { k: 'TOOLS', v: String(tools.length).padStart(2, '0') },
  { k: 'SERVERS', v: '00' },
  { k: 'UPLOADS', v: '00' },
  { k: 'TRACKERS', v: '00' },
];

export default function Dashboard() {
  return (
    <Box>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <Box sx={{ mb: { xs: 5, md: 7 } }}>
        <Typography variant="overline" color="text.secondary" component="p" sx={{ mb: 2 }}>
          ── Index / Vol. 01 — a workbench for the unglamorous parts of the job
        </Typography>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '3.4rem', sm: '5.5rem', lg: '7.5rem' },
            textTransform: 'uppercase',
            mb: 3,
          }}
        >
          Format.
          <br />
          Convert.{' '}
          <Box
            component="span"
            sx={{
              bgcolor: 'accent.main',
              color: 'accent.contrastText',
              px: { xs: 1, sm: 1.5 },
              boxDecorationBreak: 'clone',
              WebkitBoxDecorationBreak: 'clone',
            }}
          >
            Ship.
          </Box>
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
            gap: { xs: 3, md: 6 },
            alignItems: 'end',
          }}
        >
          <Typography variant="body1" sx={{ fontSize: '1.1rem', maxWidth: '58ch' }}>
            Paste the ugly payload, get back something you’d put in a PR. Every tool here runs entirely in your
            browser — nothing is sent anywhere, so go ahead and paste the production config.{' '}
            <Box component="span" sx={{ color: 'text.secondary' }}>
              (We still wouldn’t recommend it.)
            </Box>
          </Typography>

          <Box
            component="dl"
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, auto)' },
              // Rules drawn by the 2px gap showing the ink background through.
              gap: '2px',
              m: 0,
              border: 2,
              borderColor: 'text.primary',
              bgcolor: 'text.primary',
            }}
          >
            {facts.map((f) => (
              <Box key={f.k} sx={{ px: 2, py: 1.25, bgcolor: 'background.paper' }}>
                <Typography component="dt" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {f.k}
                </Typography>
                <Typography component="dd" variant="h5" sx={{ m: 0, fontSize: '1.75rem', lineHeight: 1.1 }}>
                  {f.v}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Tool index ───────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6" component="h2">
          The tools
        </Typography>
        <Box aria-hidden sx={{ flex: 1, borderTop: 2, borderColor: 'text.primary' }} />
        <Typography variant="caption" color="text.secondary">
          {tools.length} ENTRIES
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
          // Ruled grid: each cell draws its right+bottom rule, the container
          // draws top+left, so lines never double up.
          borderTop: 2,
          borderLeft: 2,
          borderColor: 'text.primary',
          bgcolor: 'background.paper',
        }}
      >
        {tools.map(({ code, tag, title, description, path, Icon }, idx) => (
          <Box
            component="li"
            key={path}
            sx={{
              borderRight: 2,
              borderBottom: 2,
              borderColor: 'text.primary',
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
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: { xs: 200, md: 240 },
                p: { xs: 2.5, md: 3 },
                color: 'text.primary',
                textDecoration: 'none',
                position: 'relative',
                transition: 'background-color 120ms, color 120ms',
                '&:hover, &:focus-visible': {
                  bgcolor: 'text.primary',
                  color: 'background.default',
                  outlineOffset: -4,
                  '& .tile-desc': { color: 'inherit', opacity: 0.8 },
                  '& .tile-arrow': { bgcolor: 'accent.main', color: 'accent.contrastText', transform: 'rotate(0deg)' },
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 'auto' }}>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  T/{code} <Box component="span" sx={{ opacity: 0.6, ml: 1 }}>{tag}</Box>
                </Typography>
                <Icon aria-hidden sx={{ fontSize: 22, opacity: 0.85 }} />
              </Box>

              <Typography
                variant="h3"
                component="h3"
                sx={{
                  mt: 4,
                  mb: 1,
                  fontSize: { xs: '2rem', md: idx === 0 ? '3rem' : '2.25rem' },
                  textTransform: 'uppercase',
                  lineHeight: 0.95,
                }}
              >
                {title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                <Typography className="tile-desc" variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                  {description}
                </Typography>
                <Box
                  className="tile-arrow"
                  aria-hidden
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    border: 2,
                    borderColor: 'currentColor',
                    transform: 'rotate(-45deg)',
                    transition: 'transform 160ms cubic-bezier(0.2, 0, 0, 1)',
                  }}
                >
                  <ArrowOutward sx={{ fontSize: 18, transform: 'rotate(45deg)' }} />
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
