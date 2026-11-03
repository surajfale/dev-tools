import { createTheme } from '@mui/material/styles';

/**
 * "Workbench Spec Sheet" theme.
 *
 * A brutalist / editorial take on a developer toolbox: warm paper + ink,
 * one loud signal-orange accent, hard 2px rules, square corners and hard
 * offset shadows instead of soft blurred elevation.
 *
 * All text/background pairs below were checked for WCAG AA (>= 4.5:1).
 * The bright `accent` orange is only ever used as a FILL behind ink text
 * (5.9:1) — orange-as-text uses the darker `secondary.main` in light mode.
 */

export const FONT_DISPLAY = '"Archivo", "Arial Narrow", "Helvetica Neue", Arial, sans-serif';
export const FONT_BODY = '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif';
export const FONT_MONO = '"JetBrains Mono", "Fira Code", ui-monospace, Menlo, Consolas, "Liberation Mono", monospace';

const tokens = {
  light: {
    bg: '#EEEAE0', // bone paper
    paper: '#F8F6F0',
    ink: '#16150F',
    inkMuted: '#5C574C',
    rule: '#16150F',
    ruleSoft: 'rgba(22,21,15,0.16)',
    grid: 'rgba(22,21,15,0.055)',
    accent: '#FF5A1F', // signal orange (fill only)
    accentText: '#B03A0A', // orange that passes AA as text on paper
    error: '#B42318',
    success: '#2F6B3A',
    info: '#1F4FC4',
    warning: '#8A5300',
  },
  dark: {
    bg: '#121110',
    paper: '#1B1A17',
    ink: '#EDE8DC',
    inkMuted: '#A39E92',
    rule: '#EDE8DC',
    ruleSoft: 'rgba(237,232,220,0.16)',
    grid: 'rgba(237,232,220,0.04)',
    accent: '#FF6A33',
    accentText: '#FF6A33',
    error: '#FF7A70',
    success: '#7BD08F',
    info: '#8AB4FF',
    warning: '#F2B84B',
  },
};

// Hard offset shadows — one consistent elevation language for the whole app.
const hardShadow = (color, n = 4) => `${n}px ${n}px 0 0 ${color}`;

const motion = '120ms cubic-bezier(0.2, 0, 0, 1)';

function buildTheme(mode) {
  const t = tokens[mode];
  const isDark = mode === 'dark';

  // MUI expects 25 shadow levels. Small elevations get a small hard shadow,
  // overlays (menus, popovers, dialogs) get the full 6px one.
  const shadows = [
    'none',
    ...Array.from({ length: 24 }, (_, i) => hardShadow(t.rule, i < 4 ? 3 : i < 8 ? 4 : 6)),
  ];

  const focusRing = {
    outline: `3px solid ${t.accent}`,
    outlineOffset: 2,
  };

  return createTheme({
    palette: {
      mode,
      primary: { main: t.ink, contrastText: t.bg },
      secondary: { main: t.accentText, contrastText: isDark ? t.bg : '#FFFFFF' },
      accent: { main: t.accent, contrastText: '#16150F' },
      error: { main: t.error },
      success: { main: t.success },
      info: { main: t.info },
      warning: { main: t.warning },
      background: { default: t.bg, paper: t.paper },
      text: { primary: t.ink, secondary: t.inkMuted, disabled: isDark ? 'rgba(237,232,220,0.38)' : 'rgba(22,21,15,0.38)' },
      divider: t.ruleSoft,
      // Custom tokens consumed via `theme.palette.workbench.*`
      workbench: t,
    },
    shape: { borderRadius: 0 },
    shadows,
    typography: {
      fontFamily: FONT_BODY,
      h1: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontStretch: '75%', letterSpacing: '-0.02em', lineHeight: 0.92 },
      h2: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontStretch: '75%', letterSpacing: '-0.015em', lineHeight: 0.95 },
      h3: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontStretch: '80%', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' },
      h4: { fontFamily: FONT_DISPLAY, fontWeight: 800, fontStretch: '75%', letterSpacing: '-0.01em', textTransform: 'uppercase', lineHeight: 1 },
      h5: { fontFamily: FONT_DISPLAY, fontWeight: 700, fontStretch: '85%', fontVariantNumeric: 'tabular-nums' },
      h6: {
        // Section labels inside tools ("Input JSON", "Formatted Output"…)
        fontFamily: FONT_MONO,
        fontWeight: 700,
        fontSize: '0.75rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      },
      subtitle2: { fontFamily: FONT_MONO, fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' },
      overline: { fontFamily: FONT_MONO, fontWeight: 500, letterSpacing: '0.14em', lineHeight: 1.6 },
      caption: { fontFamily: FONT_MONO },
      button: { fontFamily: FONT_MONO, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' },
      body1: { lineHeight: 1.6 },
      body2: { lineHeight: 1.6 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            // Engineering graph paper — 24px minor grid.
            backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundAttachment: 'fixed',
            fontFeatureSettings: '"ss01", "ss02"',
          },
          '::selection': { background: t.accent, color: '#16150F' },
          ':focus-visible': focusRing,
          kbd: {
            fontFamily: FONT_MONO,
            fontSize: '0.75em',
            fontWeight: 700,
            padding: '1px 6px',
            border: `1.5px solid ${t.rule}`,
            boxShadow: `2px 2px 0 0 ${t.rule}`,
            background: t.paper,
            whiteSpace: 'nowrap',
          },
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
            transition: `transform ${motion}, box-shadow ${motion}, background-color ${motion}`,
            '&.Mui-focusVisible': focusRing,
            '&:active': { transform: 'translate(0, 0) !important', boxShadow: 'none !important' },
          },
          sizeSmall: { fontSize: '0.72rem', padding: '5px 12px' },
          contained: {
            border: `2px solid ${t.rule}`,
            '&:hover': {
              boxShadow: hardShadow(t.accent, 3),
              transform: 'translate(-2px, -2px)',
            },
            '&.Mui-disabled': {
              border: `2px solid ${t.ruleSoft}`,
            },
          },
          outlined: {
            borderWidth: 2,
            borderColor: t.rule,
            color: t.ink,
            backgroundColor: t.paper,
            '&:hover': {
              borderWidth: 2,
              borderColor: t.rule,
              backgroundColor: t.paper,
              boxShadow: hardShadow(t.rule, 3),
              transform: 'translate(-2px, -2px)',
            },
            '&.Mui-disabled': { borderWidth: 2, borderColor: t.ruleSoft },
          },
          outlinedSecondary: {
            borderColor: t.accentText,
            color: t.accentText,
            '&:hover': { borderColor: t.accentText, boxShadow: hardShadow(t.accentText, 3) },
          },
          outlinedError: {
            borderColor: t.error,
            color: t.error,
            '&:hover': { borderColor: t.error, boxShadow: hardShadow(t.error, 3) },
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
            '& .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: t.rule },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: t.rule },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: t.accent },
            '&.Mui-focused': { boxShadow: hardShadow(t.accent, 4) },
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
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            '&.Mui-focused': { color: t.ink },
          },
        },
      },

      MuiSelect: {
        styleOverrides: {
          select: { fontFamily: FONT_MONO },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: { border: `2px solid ${t.rule}`, marginTop: 4 },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontFamily: FONT_MONO,
            fontSize: '0.85rem',
            '&.Mui-selected': { backgroundColor: t.accent, color: '#16150F' },
            '&.Mui-selected:hover': { backgroundColor: t.accent },
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          root: { padding: 10 },
          track: {
            borderRadius: 0,
            border: `2px solid ${t.rule}`,
            backgroundColor: t.paper,
            opacity: '1 !important',
          },
          thumb: {
            borderRadius: 0,
            width: 16,
            height: 16,
            marginTop: 2,
            marginLeft: 2,
            boxShadow: 'none',
            backgroundColor: t.ink,
          },
          switchBase: {
            '&.Mui-checked + .MuiSwitch-track': { backgroundColor: t.accent },
            '&.Mui-checked .MuiSwitch-thumb': { backgroundColor: '#16150F' },
            '&.Mui-focusVisible .MuiSwitch-thumb': { outline: `3px solid ${t.accent}`, outlineOffset: 2 },
          },
        },
      },

      MuiFormControlLabel: {
        styleOverrides: {
          label: { fontFamily: FONT_MONO, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
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
            border: `2px solid ${t.rule}`,
            backgroundImage: 'none',
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none', borderRadius: 0 },
          outlined: { border: `2px solid ${t.rule}` },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: { boxShadow: 'none', borderBottom: `2px solid ${t.rule}` },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `2px solid ${t.rule} !important`,
            backgroundColor: t.bg,
            backgroundImage: 'none',
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            '&.Mui-focusVisible': { ...focusRing, outlineOffset: -3 },
          },
        },
      },

      MuiTabs: {
        styleOverrides: {
          root: { minHeight: 40 },
          indicator: { height: 4, backgroundColor: t.accent },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            fontFamily: FONT_MONO,
            fontWeight: 700,
            letterSpacing: '0.08em',
            minHeight: 40,
            '&.Mui-selected': { color: t.ink },
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            border: `2px solid currentColor`,
            borderLeftWidth: 8,
            fontFamily: FONT_BODY,
            backgroundColor: t.paper,
          },
          filled: {
            border: `2px solid ${t.rule}`,
            boxShadow: hardShadow(t.rule, 4),
          },
          filledSuccess: { backgroundColor: t.accent, color: '#16150F' },
        },
      },

      MuiAlertTitle: {
        styleOverrides: {
          root: { fontFamily: FONT_MONO, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            fontFamily: FONT_MONO,
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          },
          outlined: { borderWidth: 2 },
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
          head: { fontFamily: FONT_MONO, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem' },
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
