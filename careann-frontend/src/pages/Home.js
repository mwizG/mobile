import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button } from '@mui/material';

function Home() {
  return (
    <Container maxWidth="lg">
      {/* Header and Navigation */}
      <Box
        component="header"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 3,
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
          CareAnn
        </Typography>
        <nav>
          <Link to="/services">
            <Button variant="text">Services</Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="text">How It Works</Button>
          </Link>
          <Link to="/contact">
            <Button variant="text">Contact Us</Button>
          </Link>
          <Link to="/faq">
            <Button variant="text">FAQ</Button>
          </Link>
        </nav>
      </Box>

      {/* Welcome Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to CareAnn
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          Your trusted platform to connect care seekers with caregivers.
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Link to="/login">
              <Button variant="contained" fullWidth sx={{ backgroundColor: '#81c784', '&:hover': { backgroundColor: '#66bb6a' } }}>
                Login
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Link to="/register">
              <Button variant="outlined" fullWidth>
                Register
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>

      {/* Service Overview Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
          Our Services
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, boxShadow: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h5">Respite Care</Typography>
              <Typography>Temporary relief for primary caregivers.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, boxShadow: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h5">Home Care</Typography>
              <Typography>Personal care services provided at home.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, boxShadow: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h5">Senior Care</Typography>
              <Typography>Specialized care for elderly individuals.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* About Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
          About CareAnn
        </Typography>
        <Typography sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
          CareAnn is a platform designed to connect individuals seeking care services with caregivers offering those services. Whether you need child care, senior care, or housekeeping, CareAnn is here to help.
        </Typography>
      </Box>

      {/* Footer Section */}
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body2">&copy; 2024 CareAnn. All rights reserved.</Typography>
        <Box sx={{ mt: 2 }}>
          <Link to="/terms">
            <Button variant="text">Terms of Service</Button>
          </Link>
          <Link to="/privacy">
            <Button variant="text">Privacy Policy</Button>
          </Link>
          <Link to="/contact">
            <Button variant="text">Contact</Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
