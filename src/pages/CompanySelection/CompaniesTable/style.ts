import { SxProps, Theme } from '@mui/material';

export const gridToolBarContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  pb: '10px',
};

export const toolBarFilterStyle: SxProps<Theme> = {
  bgcolor: "common.white",
  pb: "0px",
  "& .MuiOutlinedInput-root": {
    height: "40.5px",
    color: "primary.main",
    borderColor: "primary.main",
    borderRadius: "12px",
    "& fieldset": {
      borderColor: "primary.main",
      borderRadius: "12px",
    },
    '&:hover fieldset': {
      borderColor: 'primary.main',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
    },
  },
  width: { xs: '100%', md: '300px' },
};

export const dataGridStyle: SxProps<Theme> = {
  color: 'primary.main',
  border: 0,
  fontSize: '16px',
};

export const esgRatingColumnStyle: SxProps<Theme> = {
  display: 'flex',
  flexGrow: '1',
  gap: '15px',
  alignItems: 'center',
  width: '100%',
};
