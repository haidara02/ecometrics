import { SxProps, Theme } from '@mui/material';

export const UserInstructionStyle: SxProps<Theme> = {
  direction: 'flex',
  flexDirection: 'column',
  margin: '20px 0 0 0',
  border: 0,
  borderRadius: 1,
  borderLeft: '5px solid #008aa4',
  bgcolor: 'rgb(207,235,241, 0.4)',
  '&.Mui-expanded:first-of-type': {
    marginTop: '25px',
  },
  alignItems: 'center',
  justifyContent: 'center',
};
