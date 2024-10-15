import { SxProps, Theme } from '@mui/material';

export const companiesContentContainer: SxProps<Theme> = {
  p: { xs: 2, md: 8 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  height: '100%',
  width: '100%',
  boxSizing: 'border-box',
};

export const companyContentHeader: SxProps<Theme> = {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
};

export const metricsViewButton: SxProps<Theme> = {
  borderRadius: '8px',
  color: 'white',
  fontSize: '30px',
  height: '50px',
  padding: '15px',
  '&:disabled': {
    color: 'gray',
  },
};
