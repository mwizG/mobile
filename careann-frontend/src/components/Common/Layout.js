import React from 'react';
import { Box, CssBaseline, Container } from '@mui/material';
import Drawer from './Drawer'; // Your sidebar component

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Drawer /> {/* Sidebar Component */}
      <Container 
        sx={{
          flexGrow: 1,
          padding: { xs: 2, sm: 3, md: 4 },
          marginLeft: { sm: '240px' } // Adjust based on sidebar width
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
