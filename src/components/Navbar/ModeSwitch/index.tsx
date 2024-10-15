import { Switch, useMediaQuery } from '@mui/material';
import { useThemeContext } from '../../../context/ThemeContextProvider';
import { useEffect } from 'react';

import darkLogo from '../../../assets/dark.svg';
import lightLogo from '../../../assets/light.svg';

const ModeSwitch: React.FC = () => {
  const { mode, toggleMode } = useThemeContext();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  useEffect(() => {
    if (localStorage.getItem('themeMode') == null) {
      if (prefersDarkMode) {
        toggleMode();
      }
    } // eslint-disable-next-line
  }, []);

  return (
    <Switch
      onChange={toggleMode}
      checked={mode === 'dark'}
      sx={{
        width: 60,
        height: 34,
        padding: 0.8,
        '& .MuiSwitch-switchBase': {
          mt: 0.1,
          padding: 0,
          transform: 'translateX(6px)',
          '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
              backgroundImage: `url(${darkLogo})`,
              backgroundSize: '60%',
            },
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: mode === 'dark' ? '#8796A5' : '#aab4be',
            },
          },
        },
        '& .MuiSwitch-thumb': {
          backgroundColor: mode === 'dark' ? '#013257' : 'white',
          width: 32,
          height: 32,
          '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(${lightLogo})`,
            backgroundSize: '70%',
          },
        },
        '& .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: mode === 'dark' ? '#8796A5' : '#aab4be',
          borderRadius: 20 / 2,
        },
      }}
    />
  );
};

export default ModeSwitch;
