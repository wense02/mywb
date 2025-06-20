// src/theme.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Common settings for both themes
const commonSettings = {
  typography: {
    fontFamily: 'Inter, sans-serif', // Assuming you use Inter font
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Keep button text as is
          borderRadius: '8px', // Rounded corners for buttons
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // No default shadow for AppBar
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: 'none', // No default shadow for Drawer
        },
      },
    },
  },
};

// Light Theme
let lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007bff', // Blue
      light: '#e6f2ff', // Lighter blue for hover/active states
    },
    secondary: {
      main: '#6c757d', // Grey
    },
    error: {
      main: '#dc3545', // Red
    },
    warning: {
      main: '#ffc107', // Yellow
    },
    info: {
      main: '#17a2b8', // Cyan
    },
    success: {
      main: '#28a745', // Green
    },
    background: {
      default: '#ffffff',
      paper: '#f8f8f8',
    },
    text: {
      primary: '#333333',
      secondary: '#6c757d',
    },
  },
  ...commonSettings,
});

// Dark Theme
let darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#61dafb', // Cyan (React blue)
      light: '#2a4d55', // Darker cyan for hover/active states
    },
    secondary: {
      main: '#adb5bd', // Lighter grey
    },
    error: {
      main: '#dc3545',
    },
    warning: {
      main: '#ffc107',
    },
    info: {
      main: '#17a2b8',
    },
    success: {
      main: '#28a745',
    },
    background: {
      default: '#282c34', // Dark background
      paper: '#333333', // Slightly lighter dark for paper elements
    },
    text: {
      primary: '#f0f0f0',
      secondary: '#adb5bd',
    },
  },
  ...commonSettings,
});

// Make font sizes responsive
lightTheme = responsiveFontSizes(lightTheme);
darkTheme = responsiveFontSizes(darkTheme);

export { lightTheme, darkTheme };