import { createTheme, Theme } from '@mui/material';
import { createContext, FC, PropsWithChildren, useContext } from 'react';
import { useMode } from '../utils/use-mode';

type ThemeType = {
  mode: string;
  toggleMode: () => void;
  theme: Theme;
};

export const ThemeContext = createContext<ThemeType>({
  mode: 'light',
  toggleMode: () => {},
  theme: createTheme(),
});

export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useMode();
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
