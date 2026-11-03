import { createTheme } from '@mui/material/styles';

/**
 * "Mission Control" theme.
 *
 * A restrained HUD: graphite (dark) or blueprint (light) grounds, 1px hairline
 * rules, bracketed corners instead of full boxes, and a single amber phosphor
 * accent. Motion lives in a few dedicated components (BootSequence,
 * OrbitRings, CodeBlock's typing reveal), not in the theme.
 *
 * Every text/background pair below was checked for WCAG AA (>= 4.5:1).
 * `accent` (#FFB020) is a FILL colour, always paired with `accentInk` text;
 * amber used as text in light mode is the darker `accentText`.
 */

export const FONT_DISPLAY = '"Saira", "Arial Narrow", "Helvetica Neue", Arial, sans-serif';
export const FONT_BODY = '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif';
export const FONT_MONO = '"JetBrains Mono", "Fira Code", ui-monospace, Menlo, Consolas, "Liberation Mono", monospace';

const tokens = {
  dark: {
    bg: '#0A0E12', // graphite
    paper: '#0E1419',
    ink: '#DAE3EB',
    inkMuted: '#8494A3',
    rule: 'rgba(218,227,235,0.22)',
    ruleSoft: 'rgba(218,227,235,0.12)',
    grid: 'rgba(218,227,235,0.035)',
    accent: '#FFB020', // amber phosphor (fill)
    accentInk: '#0A0E12',
    accentText: '#FFB020',
    error: '#FF8A80',
    success: '#7BD88F',
    info: '#8EC5FF',
    warning: '#FFB020',
    codeString: '#9ED7A6',
    codeNumber: '#8EC5FF',
  },
  light: {
    bg: '#E7EDF2', // blueprint
    paper: '#F4F7FA',
    ink: '#0B2236',
    inkMuted: '#4A6074',
    rule: 'rgba(11,34,54,0.28)',
    ruleSoft: 'rgba(11,34,54,0.14)',
    grid: 'rgba(11,34,54,0.06)',
    accent: '#FFB020',
    accentInk: '#0B2236',
    accentText: '#8F5400',
    error: '#B42318',
    success: '#2E7D45',
    info: '#1F4FC4',
    warning: '#8A5300',
    codeString: '#2E6B3E',
    codeNumber: '#1F4FC4',
  },
};

/**
 * Bracketed-corner background: four 1px strokes in the top-left and
 * bottom-right corners layered over a surface colour. Use as `background`.
 */
export function bracketBackground(color, surface, size = 10) {
  const stroke = `linear-gradient(${color}, ${color})`;
  return [
    `${stroke} top left / ${size}px 1px no-repeat`,
    `${stroke} top left / 1px ${size}px no-repeat`,
    `${stroke} bottom right / ${size}px 1px no-repeat`,
    `${stroke} bottom right / 1px ${size}px no-repeat`,
    surface,
  ].join(', ');
}

const motion = '150ms cubic-bezier(0.2, 0, 0, 1)';

function buildTheme(mode) {
  const t = tokens[mode];
  const isDark = mode === 'dark';

  const ring = (alpha = 0.3) => `0 0 0 3px ${isDark ? `rgba(255,176,32,${alpha})` : `rgba(143,84,0,${alpha})`}`;
  // Overlays (menus, popovers, dialogs) get a hairline plus a soft drop so
  // they lift off the grid; nothing else casts a shadow.
  const overlayShadow = `0 0 0 1px ${t.rule}, 0 16px 40px -16px rgba(0,0,0,${isDark ? 0.7 : 0.35})`;
  const shadows = ['none', ...Array.from({ length: 24 }, (_, i) => (i < 4 ? 'none' : overlayShadow))];

  const focusRing = { outline: `2px solid ${t.accent}`, outlineOffset: 2 };

  return createTheme({
    palette: {
      mode,
      primary: { main: t.ink, contrastText: t.bg },
      secondary: { main: t.accentText, contrastText: t.accentInk },
      accent: { main: t.accent, contrastText: t.accentInk },
      error: { main: t.error },
      success: { main: t.success },
      info: { main: t.info },
      warning: { main: t.warning },
      background: { default: t.bg, paper: t.paper },
      text: {
        primary: t.ink,
        secondary: t.inkMuted,
        disabled: isDark ? 'rgba(218,227,235,0.38)' : 'rgba(11,34,54,0.38)',
      },
      divider: t.ruleSoft,
      // Raw design tokens, consumed via `theme.palette.tokens.*`
      tokens: t,
    },
    shape: { borderRadius: 0 },
    shadows,
    typography: {
      fontFamily: FONT_BODY,
      h1: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontStretch: '58%', letterSpacing: '0.005em', lineHeight: 0.92, textTransform: 'uppercase' },
      h2: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontStretch: '62%', lineHeight: 0.95, textTransform: 'uppercase' },
      h3: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontStretch: '70%', letterSpacing: '0.01em', fontVariantNumeric: 'tabular-nums' },
      h4: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontStretch: '58%', letterSpacing: '0.01em', textTransform: 'uppercase', lineHeight: 0.95 },
      h5: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontStretch: '70%', fontVariantNumeric: 'tabular-nums' },
      h6: {
        // Section labels inside tools ("Input JSON", "Formatted Output"…)
        fontFamily: FONT_MONO,
        fontWeight: 500,
        fontSize: '0.72rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      },
      subtitle2: { fontFamily: FONT_MONO, fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' },
      overline: { fontFamily: FONT_MONO, fontWeight: 500, letterSpacing: '0.14em', lineHeight: 1.6 },
      caption: { fontFamily: FONT_MONO },
      button: { fontFamily: FONT_MONO, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' },
      body1: { lineHeight: 1.6 },
      body2: { lineHeight: 1.6 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            // Plotting grid — 32px.
            backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            backgroundAttachment: 'fixed',
          },
          '::selection': { background: t.accent, color: t.accentInk },
          ':focus-visible': focusRing,
          kbd: {
            fontFamily: FONT_MONO,
            fontSize: '0.75em',
            fontWeight: 500,
            padding: '1px 6px',
            border: `1px solid ${t.rule}`,
            background: t.paper,
            color: t.ink,
            whiteSpace: 'nowrap',
          },
          '@keyframes mc-blink': { '50%': { opacity: 0 } },
          '@keyframes mc-spin': { to: { transform: 'rotate(360deg)' } },
          '*, *::before, *::after': {
            '@media (prefers-reduced-motion: reduce)': {
              animationDuration: '0.001ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '0.001ms !important',
            },
          },
        },
      },

      MuiButtonBase: {
        defaultProps: { disableRipple: true },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 0,
            minHeight: 36,
            transition: `box-shadow ${motion}, background-color ${motion}, border-color ${motion}`,
            '&.Mui-focusVisible': focusRing,
          },
          sizeSmall: { fontSize: '0.7rem', padding: '5px 12px' },
          contained: {
            // The one loud control on a screen: amber fill, ink text.
            backgroundColor: t.accent,
            color: t.accentInk,
            border: `1px solid ${t.accent}`,
            '&:hover': { backgroundColor: t.accent, boxShadow: ring() },
            '&.Mui-disabled': { border: `1px solid ${t.ruleSoft}` },
          },
          outlined: {
            borderColor: t.rule,
            color: t.ink,
            '&:hover': { borderColor: t.ink, backgroundColor: 'transparent', boxShadow: ring(0.18) },
            '&.Mui-disabled': { borderColor: t.ruleSoft },
          },
          outlinedSecondary: {
            borderColor: t.accentText,
            color: t.accentText,
            '&:hover': { borderColor: t.accentText },
          },
          outlinedError: {
            borderColor: t.error,
            color: t.error,
            '&:hover': { borderColor: t.error },
          },
          text: {
            '&:hover': { backgroundColor: t.ruleSoft },
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            '&:hover': { backgroundColor: t.ruleSoft },
            '&.Mui-focusVisible': focusRing,
          },
        },
      },

      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          fullWidth: true,
          multiline: true,
          minRows: 4,
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            backgroundColor: t.paper,
            fontFamily: FONT_MONO,
            fontSize: '0.875rem',
            transition: `box-shadow ${motion}`,
            '& .MuiOutlinedInput-notchedOutline': { borderWidth: 1, borderColor: t.rule },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: t.ink },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 1, borderColor: t.accentText },
            '&.Mui-focused': { boxShadow: ring(0.22) },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: t.error },
          },
          input: {
            '&::placeholder': { color: t.inkMuted, opacity: 1 },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontFamily: FONT_MONO,
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            '&.Mui-focused': { color: t.accentText },
          },
        },
      },

      MuiSelect: {
        styleOverrides: { select: { fontFamily: FONT_MONO } },
      },

      MuiMenu: {
        styleOverrides: { paper: { marginTop: 4, backgroundColor: t.paper } },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontFamily: FONT_MONO,
            fontSize: '0.85rem',
            '&.Mui-selected': { backgroundColor: t.accent, color: t.accentInk },
            '&.Mui-selected:hover': { backgroundColor: t.accent },
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          root: { padding: 10 },
          track: {
            borderRadius: 0,
            border: `1px solid ${t.rule}`,
            backgroundColor: 'transparent',
            opacity: '1 !important',
          },
          thumb: {
            borderRadius: 0,
            width: 14,
            height: 14,
            margin: 3,
            boxShadow: 'none',
            backgroundColor: t.inkMuted,
          },
          switchBase: {
            '&.Mui-checked + .MuiSwitch-track': { backgroundColor: t.accent, borderColor: t.accent },
            '&.Mui-checked .MuiSwitch-thumb': { backgroundColor: t.accentInk },
            '&.Mui-focusVisible .MuiSwitch-thumb': { outline: `2px solid ${t.accent}`, outlineOffset: 2 },
          },
        },
      },

      MuiFormControlLabel: {
        styleOverrides: {
          label: { fontFamily: FONT_MONO, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' },
        },
      },

      MuiRadio: {
        styleOverrides: { root: { '&.Mui-checked': { color: t.accentText } } },
      },

      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 0,
            border: `1px solid ${t.ruleSoft}`,
            background: bracketBackground(t.accentText, t.paper),
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none', borderRadius: 0 },
          outlined: {
            border: `1px solid ${t.ruleSoft}`,
            background: bracketBackground(t.accentText, t.paper),
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: { boxShadow: 'none', borderBottom: `1px solid ${t.rule}` },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${t.rule} !important`,
            backgroundColor: t.bg,
            backgroundImage: 'none',
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            '&.Mui-focusVisible': { ...focusRing, outlineOffset: -2 },
          },
        },
      },

      MuiTabs: {
        styleOverrides: {
          root: { minHeight: 40 },
          indicator: { height: 2, backgroundColor: t.accent },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            fontFamily: FONT_MONO,
            fontWeight: 500,
            letterSpacing: '0.1em',
            minHeight: 40,
            '&.Mui-selected': { color: t.ink },
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            border: '1px solid currentColor',
            borderLeftWidth: 4,
            backgroundColor: t.paper,
          },
          filled: { border: `1px solid ${t.rule}`, boxShadow: overlayShadow },
          filledSuccess: { backgroundColor: t.accent, color: t.accentInk },
        },
      },

      MuiAlertTitle: {
        styleOverrides: {
          root: { fontFamily: FONT_MONO, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.78rem' },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            fontFamily: FONT_MONO,
            fontWeight: 500,
            fontSize: '0.7rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          },
        },
      },

      MuiTooltip: {
        defaultProps: { arrow: false },
        styleOverrides: {
          tooltip: {
            borderRadius: 0,
            backgroundColor: t.ink,
            color: t.bg,
            fontFamily: FONT_MONO,
            fontSize: '0.7rem',
            letterSpacing: '0.04em',
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: { borderBottom: `1px solid ${t.ruleSoft}` },
          head: { fontFamily: FONT_MONO, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', color: t.inkMuted },
        },
      },

      MuiDivider: {
        styleOverrides: { root: { borderColor: t.ruleSoft } },
      },

      MuiCircularProgress: {
        defaultProps: { color: 'secondary' },
      },
    },
  });
}

export const lightTheme = buildTheme('light');
export const darkTheme = buildTheme('dark');
