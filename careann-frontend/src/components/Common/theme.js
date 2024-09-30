import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    h1: {
      fontSize: '1.5rem', // Reduced for small screens
      [createTheme().breakpoints.up('sm')]: {
        fontSize: '2rem', // Reduced for medium screens
      },
      [createTheme().breakpoints.up('md')]: {
        fontSize: '2.5rem', // Reduced for larger screens
      },
      [createTheme().breakpoints.up('lg')]: {
        fontSize: '3rem', // Slightly smaller for large screens
      },
    },
    body1: {
      fontSize: '0.875rem', // Slightly smaller for small screens
      [createTheme().breakpoints.up('sm')]: {
        fontSize: '1rem', // Normal size for medium screens
      },
      [createTheme().breakpoints.up('md')]: {
        fontSize: '1.1rem', // Slightly smaller for large screens
      },
    },
  },
  // You can add global padding, margins, or spacing here
});

export default theme;
