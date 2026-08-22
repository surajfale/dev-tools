import { createTheme } from '@mui/material/styles';

const fontFamily = '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';

const typography = {
  fontFamily,
  h4: {
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  h5: {
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  h6: {
    fontWeight: 600,
  },
  subtitle1: {
    fontWeight: 500,
  },
  button: {
    fontWeight: 500,
  },
  body1: {
    lineHeight: 1.6,
  },
  body2: {
    lineHeight: 1.6,
  },
};

const shape = {
  borderRadius: 10,
};

const transition = 'all 180ms cubic-bezier(0.4, 0, 0.2, 1)';

function buildComponents(mode) {
  const isDark = mode === 'dark';

  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': {
          '@media (prefers-reduced-motion: reduce)': {
            animationDuration: '0.001ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.001ms !important',
          },
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
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, Menlo, Consolas, monospace',
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          transition,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: isDark
              ? '0 4px 14px 0 rgba(0,0,0,0.4)'
              : '0 4px 14px 0 rgba(37,99,235,0.25)',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(15,23,42,0.08)'}`,
          backgroundImage: 'none',
          transition,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginLeft: 8,
          marginRight: 8,
          width: 'auto',
          transition,
          '&.Mui-selected': {
            fontWeight: 600,
          },
          '&.Mui-selected .MuiListItemText-primary': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
  };
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
    },
    secondary: {
      main: '#7C3AED',
    },
    success: {
      main: '#16A34A',
    },
    error: {
      main: '#DC2626',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: 'rgba(15,23,42,0.08)',
  },
  typography,
  shape,
  components: buildComponents('light'),
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60A5FA',
    },
    secondary: {
      main: '#A78BFA',
    },
    success: {
      main: '#22C55E',
    },
    error: {
      main: '#F87171',
    },
    background: {
      default: '#0B1220',
      paper: '#111C33',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography,
  shape,
  components: buildComponents('dark'),
});
