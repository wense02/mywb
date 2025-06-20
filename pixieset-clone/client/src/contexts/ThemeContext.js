// src/contexts/ThemeContext.js
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'; // Import MUI ThemeProvider
import { lightTheme, darkTheme } from '../theme/theme.js'; // Import your MUI themes

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Initialize mode from localStorage or default to 'light'
    return localStorage.getItem('themeMode') || 'light';
  });

  // Memoize the MUI theme object to prevent unnecessary re-renders
  const muiTheme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  useEffect(() => {
    // Save theme mode to localStorage whenever it changes
    localStorage.setItem('themeMode', mode);
    // Optionally, set a data-theme attribute on body for non-MUI elements or global CSS
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}> {/* Wrap children with MUI ThemeProvider */}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};