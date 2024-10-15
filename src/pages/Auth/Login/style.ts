import { SxProps, Theme } from '@mui/material';

export const loginTitleStyle: SxProps<Theme> = {
  fontWeight: '500',
  fontSize: {
    xs: '29px',
    sm: '40px',
    md: '52px',
  },
  component: 'h1',
  variant: 'h2',
  marginBottom: {
    xs: '24px',
    sm: '40px',
    md: '80px',
  },
};

export const forgotPasswordStyle: SxProps<Theme> = {
  color: 'primary.main',
  marginTop: '18px',
  marginBottom: '35px',
  textAlign: 'right',
};

export const loginButtonStyle: SxProps<Theme> = {
  height: '55px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
