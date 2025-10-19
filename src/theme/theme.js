import { createTheme } from '@mui/material/styles';

// Configuration du thème pour l'application de recettes
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007BFF', // Bleu principal
      light: '#4DA6FF',
      dark: '#0056b3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF6B6B', // Rouge/orange pour accent
      light: '#FF9999',
      dark: '#CC5555',
      contrastText: '#ffffff',
    },
    success: {
      main: '#28A745',
      light: '#5CB85C',
      dark: '#1E7E34',
    },
    error: {
      main: '#DC3545',
      light: '#E57373',
      dark: '#C82333',
    },
    warning: {
      main: '#FFC107',
      light: '#FFD54F',
      dark: '#FFA000',
    },
    info: {
      main: '#17A2B8',
      light: '#58C3D1',
      dark: '#117A8B',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Exo',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.15)',
    // Les autres niveaux d'ombre par défaut de MUI
    '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)',
    '0px 3px 6px rgba(0,0,0,0.15), 0px 2px 4px rgba(0,0,0,0.12)',
    '0px 10px 20px rgba(0,0,0,0.15), 0px 3px 6px rgba(0,0,0,0.10)',
    '0px 15px 25px rgba(0,0,0,0.15), 0px 5px 10px rgba(0,0,0,0.05)',
    '0px 20px 40px rgba(0,0,0,0.2)',
    '0px 25px 50px rgba(0,0,0,0.25)',
    '0px 30px 60px rgba(0,0,0,0.3)',
    '0px 35px 70px rgba(0,0,0,0.35)',
    '0px 40px 80px rgba(0,0,0,0.4)',
    '0px 45px 90px rgba(0,0,0,0.45)',
    '0px 50px 100px rgba(0,0,0,0.5)',
    '0px 55px 110px rgba(0,0,0,0.55)',
    '0px 60px 120px rgba(0,0,0,0.6)',
    '0px 65px 130px rgba(0,0,0,0.65)',
    '0px 70px 140px rgba(0,0,0,0.7)',
    '0px 75px 150px rgba(0,0,0,0.75)',
    '0px 80px 160px rgba(0,0,0,0.8)',
    '0px 85px 170px rgba(0,0,0,0.85)',
    '0px 90px 180px rgba(0,0,0,0.9)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#007BFF',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
        },
        elevation2: {
          boxShadow: '0px 4px 8px rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0px 8px 16px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  spacing: 8,
});

export default theme;
