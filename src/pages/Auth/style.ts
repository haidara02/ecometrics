import { SxProps, Theme } from '@mui/material';

export const rightAuthContainer: SxProps<Theme> = {
  width: '55%',
  flexDisplay: 'flex',
  maxHeight: '100vh',
  overflow: 'hidden',
};

export const transitionAuthContainer = (action?: string): SxProps<Theme> => ({
  display: 'flex',
  flexDirection: 'column',
  transform: `translateY(${action === 'login' ? '0' : '-100'}vh)`,
  transition: `transform 400ms ease-out`,
});

export const authContainer: SxProps<Theme> = {
  display: 'flex',
  height: '100vh',
  overflowY: 'auto',
};

export const authContentContainer = {
  padding: '0 24px',
  maxWidth: '540px',
  m: 'auto',
};
