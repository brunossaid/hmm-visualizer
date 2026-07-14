import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#556B2F',
      contrastText: '#fff',
    },
    secondary: { main: '#293318' },
  },

  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#556B2F',
          },

          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5c7a26',
          },

          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5c7a26',
            borderWidth: 2,
          },
          '& input': {
            color: '#fff',
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#556B2F',

          '&.Mui-focused': {
            color: '#556B2F',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        outlined: {
          color: '#fff',
          borderColor: '#556B2F',

          '&:hover': {
            borderColor: '#5c7a26',
          },
        },
      },
    },
  },
});

export default theme;
