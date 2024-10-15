import { createTheme, PaletteMode } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { getTheme } from './theme';

export const useMode = () => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    return (localStorage.getItem('themeMode') as PaletteMode) || 'light';
  });

  const toggleMode = () => {
    const newMode: PaletteMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode') as PaletteMode;
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);

  const modifiedTheme = useMemo(() => createTheme(getTheme(mode)), [mode]);

  return {
    theme: modifiedTheme,
    mode,
    toggleMode,
  };
};
