import { SxProps, Theme } from '@mui/material';
import { DEFAULT_RATING_BAR_HEIGHT } from '../RatingBar';

export const valueComparisonContainer = (value: number): SxProps<Theme> => ({
  backgroundColor:
    value > 0 ? 'success.50' : value < 0 ? 'error.50' : 'neutral.50',
  padding: '3px',
  borderRadius: 6,
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '50px',
  height: `${DEFAULT_RATING_BAR_HEIGHT + 5}px`,
});
