'use client';

import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#ffffff', paper: '#f4f4f6' },
    text: { primary: '#323443' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#323443', paper: '#3e3f52' },
    text: { primary: '#ededed' },
  },
});

export default function MuiProvider({ children }: { children: React.ReactNode }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  return <ThemeProvider theme={prefersDark ? darkTheme : lightTheme}>{children}</ThemeProvider>;
}
