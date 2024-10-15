import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { PaletteMode, ThemeOptions } from '@mui/material';

export const greyScale = {
  light: '#e6e8eb',
  main: '#afb1b3',
  dark: '#464749',
  '50': '#edf0f2',
  '100': '#e6e8eb',
  '200': '#dcdfe1',
  '300': '#cfd1d4',
  '400': '#c0c1c3',
  '500': '#afb1b3',
  '600': '#8c8f92',
  '700': '#686b6e',
  '800': '#464749',
  '900': '#232425',
};

const typographyDefaults = {
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  h1: {
    fontSize: '39px',
    fontWeight: 'bold',
  },
  h2: {
    fontSize: '31px',
    fontWeight: 'bold',
  },
  h3: {
    fontSize: '25px',
    fontWeight: 'bold',
  },
  h4: {
    fontSize: '20px',
    fontWeight: '600',
  },
  body1: {
    fontSize: '16px',
  },
  subtitle1: {
    fontSize: '13px',
  },
  caption: {
    fontSize: '13px',
  },
};

const textFieldDefaults = {
  borderRadius: '12px',
  margin: '10px 0',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#c9d2de',
      borderRadius: '12px',
    },
    '&:hover fieldset': {
      borderColor: '#8c8f92',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid #114b77',
    },
  },
};

const dataGridDefaults = {
  '& .MuiDataGrid-columnHeader:focus, .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
};

declare module '@mui/material/styles/createPalette' {
  export interface PaletteOptions {
    neutral: {
      light: string;
      main: string;
      dark: string;
      '50': string;
      '100': string;
      '200': string;
      '300': string;
      '400': string;
      '500': string;
      '600': string;
      '700': string;
      '800': string;
      '900': string;
    };
  }
}

const primaryColours = {
  '50': '#cce1f1',
  '100': '#abcce7',
  '200': '#82acce',
  '300': '#3a6f97',
  '400': '#114b77',
  '500': '#013257',
  '600': '#002948',
  '700': '#002038',
  '800': '#001c30',
  '900': '#001d33',
};

const secondaryColours = {
  '50': '#c2f0ea',
  '100': '#b5f2ea',
  '200': '#8ae3d3',
  '300': '#54d6c4',
  '400': '#33ceb9',
  '500': '#00c2a7',
  '600': '#00b198',
  '700': '#008a77',
  '800': '#006b5c',
  '900': '#01312b',
};

const successColours = {
  '50': '#ecfdee',
  '100': '#dbf0dc',
  '200': '#b8e0b9',
  '300': '#94d196',
  '400': '#6dc070',
  '500': '#4caf50',
  '600': '#3c8b3f',
  '700': '#2e6b30',
  '800': '#1f4720',
  '900': '#162723',
};

const infoColours = {
  // teal
  '50': '#cfebf1',
  '100': '#b0dbe3',
  '200': '#8ac9d5',
  '300': '#54b1c2',
  '400': '#33a1b6',
  '500': '#008aa4',
  '600': '#007e95',
  '700': '#006274',
  '800': '#004c5a',
  '900': '#003a45',
};

const errorColours = {
  '50': '#fae6e6',
  '100': '#efb0b0',
  '200': '#e88a8a',
  '300': '#dd5454',
  '400': '#d63333',
  '500': '#c90000',
  '600': '#ba0000',
  '700': '#910000',
  '800': '#700000',
  '900': '#271819',
};

const warningColours = {
  '50': '#f2ead5',
  '100': '#ede3be',
  '200': '#ffd599',
  '300': '#ffbf66',
  '400': '#ffaa33',
  '500': '#ff9600',
  '600': '#cc7700',
  '700': '#995900',
  '800': '#663c00',
  '900': '#523000',
};

const neutralColours = {
  '50': '#edf0f2',
  '100': '#e6e8eb',
  '200': '#dcdfe1',
  '300': '#cfd1d4',
  '400': '#c0c1c3',
  '500': '#afb1b3',
  '600': '#8c8f92',
  '700': '#686b6e',
  '800': '#464749',
  '900': '#232425',
};

const darkModeConversion = (colours: { [x: string]: any }) => {
  const keys = Object.keys(colours).map(Number);
  const copy = { ...colours };
  const original = [...keys];
  keys.sort((a, b) => b - a);
  keys.forEach((key, index) => {
    colours[original[index]] = copy[key].toString();
  });
  return colours;
};

const commonFFFOverrides = {
  styleOverrides: {
    root: {
      color: '#fff',
    },
  },
};

const lightMode: ThemeOptions = {
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#EDF0F2',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
          ...textFieldDefaults,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#8c8f92',
          '&.Mui-focused': {
            color: '#090914',
          },
        },
        asterisk: {
          color: '#c90000',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: greyScale[900],
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '12px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '15px',
          borderRadius: '9px',
          textTransform: 'none',
          backgroundColor: '#013257',
        },
        outlined: {
          backgroundColor: 'white',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#EEEEEE',
          },
          ...dataGridDefaults,
        },
      },
    },
  },
  palette: {
    text: {
      primary: '#232425',
    },
    common: {
      black: greyScale[900],
      white: greyScale[50],
    },
    primary: {
      light: '#114b77',
      main: '#013257',
      dark: '#002038',
      contrastText: '#edf0f2',
      ...primaryColours,
    },
    secondary: {
      light: '#54d6c4',
      main: '#00c2a7',
      dark: '#00b198',
      contrastText: '#edf0f2',
      ...secondaryColours,
    },
    success: {
      light: '#b8e0b9',
      main: '#4caf50',
      dark: '#2e6b30',
      contrastText: '#1f4720',
      ...successColours,
    },
    info: {
      light: '#b0dbe3',
      main: '#008aa4',
      dark: '#54b1c2',
      contrastText: '#004c5a',
      ...infoColours,
    },
    error: {
      light: '#efb0b0',
      main: '#d63333',
      dark: '#ba0000',
      contrastText: '#700000',
      ...errorColours,
    },
    warning: {
      light: '#ffd599',
      main: '#ff9600',
      dark: '#ffaa33',
      contrastText: '#663c00',
      ...warningColours,
    },
    neutral: {
      light: '#e6e8eb',
      main: '#afb1b3',
      dark: '#464749',
      ...neutralColours,
    },
  },
  typography: typographyDefaults,
};

const darkMode: ThemeOptions = {
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1f1f1f',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: '#fff',
          backgroundColor: '#1f1f1f',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          color: 'white',
          backgroundColor: 'common.white',
          input: { color: 'white' },
          textarea: { color: 'white' },
          ...textFieldDefaults,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#8c8f92',
          '&.Mui-focused': {
            color: 'primary.main',
          },
        },
        asterisk: {
          color: '#c90000',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(200, 200, 200, 0.99)',
          fontSize: '12px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'white',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '15px',
          borderRadius: '9px',
          textTransform: 'none',
          backgroundColor: '#013257',
          '&.Mui-disabled': {
            color: 'gray',
            borderColor: greyScale[600],
            borderWidth: '0.1px',
            borderStyle: 'solid',
          },
        },
        outlined: {
          backgroundColor: 'inherit',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiButton-root': {
            borderColor: greyScale[600],
            borderWidth: '0.1px',
            borderStyle: 'solid',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#1f1f1f',
            '& .MuiSvgIcon-root': {
              color: '#fff',
            },
          },
          '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
            borderBottom: '1px solid #303030',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #303030',
          },
          '& .MuiTablePagination-toolbar': {
            color: '#fff',
          },

          ...dataGridDefaults,
        },
        paper: {
          color: '#fff',
          backgroundColor: '#1f1f1f',
          '& .MuiInputBase-root': {
            color: 'gray',
          },
          ...dataGridDefaults,
        },
      },
    },
    MuiCheckbox: commonFFFOverrides,
    MuiRadio: commonFFFOverrides,
    MuiIconButton: commonFFFOverrides,
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': {
            color: '#fff',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&.Mui-disabled': {
            WebkitTextFillColor: 'gray',
          },
        },
      },
    },
  },
  palette: {
    background: {
      default: '#1c1c1c',
    },
    text: {
      primary: '#232425',
    },
    common: {
      black: greyScale[50],
      white: greyScale[900],
    },
    primary: {
      light: '#114b77',
      main: '#fff',
      dark: '#002038',
      contrastText: '#edf0f2',
      ...darkModeConversion(primaryColours),
    },
    secondary: {
      // turquoise
      light: '#54d6c4',
      main: '#00c2a7',
      dark: '#00b198',
      contrastText: '#edf0f2',
      ...darkModeConversion(secondaryColours),
    },
    success: {
      light: '#b8e0b9',
      main: '#4caf50',
      dark: '#2e6b30',
      contrastText: '#1f4720',
      ...darkModeConversion(successColours),
    },
    info: {
      // teal
      light: '#b0dbe3',
      main: '#008aa4',
      dark: '#54b1c2',
      contrastText: '#004c5a',
      ...darkModeConversion(infoColours),
    },
    error: {
      light: '#efb0b0',
      main: '#d63333',
      dark: '#ba0000',
      contrastText: '#700000',
      ...darkModeConversion(errorColours),
    },
    warning: {
      light: '#ffd599',
      main: '#ff9600',
      dark: '#ffaa33',
      contrastText: '#663c00',
      ...darkModeConversion(warningColours),
    },
    neutral: {
      light: '#e6e8eb',
      main: '#afb1b3',
      dark: '#464749',
      '50': '#232425',
      '100': '#464749',
      '200': '#686b6e',
      '300': '#8c8f92',
      '400': '#afb1b3',
      '500': '#afb1b3',
      '600': '#8c8f92',
      '700': '#686b6e',
      '800': '#464749',
      '900': '#232425',
    },
  },
  typography: typographyDefaults,
};

const theme = createTheme(darkMode);

export const getTheme = (mode: PaletteMode) => {
  if (mode === 'light') {
    return lightMode;
  }
  return darkMode;
};

export default theme;
