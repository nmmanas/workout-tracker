import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

const ThemeProvider = ({ children, tenant }) => {
  // Fetch and apply tenant-specific theme
  const theme = {
    primaryColor: tenant.primaryColor || '#007bff',
    // ... other theme properties
  };

  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};

export default ThemeProvider;