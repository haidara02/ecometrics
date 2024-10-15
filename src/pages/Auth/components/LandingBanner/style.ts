import { SxProps, Theme } from '@mui/material';

export const authHeroContainer: SxProps<Theme> = {
  bgcolor: 'primary.main',
  width: '45%',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
};

export const authHeroContentContainer: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
  zIndex: '1',
};

export const whiteCircleDecoration: SxProps<Theme> = {
  height: '343px',
  width: '512px',
  border: '7px solid white',
  borderRadius: '50%',
  position: 'absolute',
  bottom: '-185px',
  right: '-230px',
  zIndex: '0',
};

export const blueCircleDecoration: SxProps<Theme> = {
  height: '512px',
  width: '343px',
  border: '7px solid #1a4667',
  borderRadius: '50%',
  position: 'absolute',
  top: '-400px',
  left: '-200px',
  zIndex: '0',
};
