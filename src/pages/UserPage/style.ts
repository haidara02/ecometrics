import { SxProps, Theme } from '@mui/material';
import { greyScale } from '../../utils/theme';

export const userProfileContainer: SxProps<Theme> = {
  maxWidth: { sm: '550px', md: '700px' },
  boxSizing: 'border-box',
  p: '0 30px',
  margin: '50px auto',
  gap: '30px',
};

export const userAvatar: SxProps<Theme> = {
  width: '200px',
  height: '200px',
  border: '5px solid',
  borderColor: 'primary.main',
  dispaly: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const editAvatarHover: SxProps<Theme> = {
  bgcolor: `${greyScale[900]}90`,
  position: 'absolute',
  zIndex: '2',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
  borderRadius: '50%',
};

export const userProfileHeader: SxProps<Theme> = {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
};

export const LoadingProgress: SxProps<Theme> = {
  margin: 'auto',
};
