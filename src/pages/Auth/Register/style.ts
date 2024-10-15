import { SxProps, Theme } from '@mui/material';

export const registerTitleStyle: SxProps<Theme> = {
  fontWeight: '500',
  fontSize: {
    xs: '29px',
    sm: '40px',
    md: '52px',
  },
  component: 'h1',
  variant: 'h2',
};

export const signUpButtonStyle: SxProps<Theme> = {
  height: '55px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '40px',
};

export const signUpSubText: SxProps<Theme> = {
  color: '#64748B',
  fontSize: {
    xs: '13px',
    sm: '15px',
    md: '18px',
  },
  marginTop: {
    xs: '10px',
    sm: '20px',
    md: '30px',
  },
  marginBottom: {
    xs: '20px',
    sm: '30px',
    md: '50px',
  },
};
