import { createTheme } from '@mui/material/styles'

export const bankingTheme = createTheme({
  palette: {
    primary: {
      main: '#e3068b',
      dark: '#c70577',
      light: '#e83699'
    },
    secondary: {
      main: '#2c2c2c',
      dark: '#1a1a1a',
      light: '#404040'
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff'
    },
    text: {
      primary: '#2c2c2c',
      secondary: '#666666'
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#2c2c2c'
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      color: '#2c2c2c'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem'
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 6,
          padding: '14px 28px',
          fontSize: '1rem',
          boxShadow: '0 2px 8px rgba(227, 6, 139, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(227, 6, 139, 0.4)'
          }
        },
        outlined: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
          padding: '12px 24px',
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#fafafa',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff'
            }
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)'
        }
      }
    }
  }
})