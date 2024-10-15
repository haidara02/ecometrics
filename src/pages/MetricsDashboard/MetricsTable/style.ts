import { SxProps, Theme } from '@mui/material';
export const metricTableStyle: SxProps<Theme> = {
  height: '500px',
  color: 'primary.main',
  border: 0,
  borderColor: '#c9d2de',
  fontSize: '16px',
  p: '10px',
  '& .MuiDataGrid-row': {
    '& .MuiDataGrid-cell': {
      color: 'common.black',
      fontWeight: 500,
    },
  },
};
