import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button, TextField, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger menu icon

import "@fontsource/roboto"; // Defaults to weight 400
import "@fontsource/roboto/400.css"; // Specify weight
import "@fontsource/roboto/400-italic.css"; // Specify weight and style
import "@fontsource/merriweather"; // Defaults to weight 400
import "@fontsource/merriweather/400.css"; // Specify weight
import "@fontsource/merriweather/400-italic.css"; // Specify weight and style

function Home() {
  const [expanded, setExpanded] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false); // State for the drawer (hamburger menu)

  // List of services
  const services = [
    { title: 'Respite Care', description: 'Temporary relief for primary caregivers.' },
    { title: 'Home Care', description: 'Personal care services provided at home.' },
    { title: 'Senior Care', description: 'Specialized care for elderly individuals.' },
    { title: 'Child Care', description: 'Professional care for children.' },
    { title: 'Disability Care', description: 'Support services for individuals with disabilities.' },
    { title: 'Palliative Care', description: 'Care focused on improving quality of life for serious illnesses.' },
    { title: 'Post-Surgical Care', description: 'Care for individuals recovering from surgery.' },
    { title: 'Maternity Care', description: 'Care for expectant and new mothers.' },
    { title: 'Dementia Care', description: 'Care for individuals with Alzheimer’s and other forms of dementia.' },
  ];

  // This controls which tile is currently visible in the stack
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  // Shuffle through the services every 3 seconds
  React.useEffect(() => {
    if (!expanded) {
      const interval = setInterval(() => {
        setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [expanded, services.length]);

  // Click handler to expand the view
  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  // Toggle the drawer (hamburger menu)
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* AppBar with Hamburger Menu for Mobile */}
      <AppBar position="static" sx={{ backgroundColor: '#ffffff', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontFamily: 'Merriweather, serif', fontWeight: 600, color: '#333' }}>
            CareAnn
          </Typography>
          {/* Hamburger Menu Icon for small screens */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'block', md: 'none', backgroundColor: '#85CEA8' } }} // Show only on small screens
          >
            <MenuIcon />
          </IconButton>
          {/* Desktop navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Link to="/services">
              <Button variant="text" color="inherit" sx={{ color: '#666' }}>Services</Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="text" color="inherit" sx={{ color: '#666' }}>How It Works</Button>
            </Link>
            <Link to="/contact">
              <Button variant="text" color="inherit" sx={{ color: '#666' }}>Contact Us</Button>
            </Link>
            <Link to="/faq">
              <Button variant="text" color="inherit" sx={{ color: '#666' }}>FAQ</Button>
            </Link>
            <Link to="/login">
              <Button variant="text" sx={{ color: '#85CEA8' }}>Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="contained" sx={{ ml: 2, backgroundColor: '#66bb6a', color: '#fff', '&:hover': { backgroundColor: '#85CEA8' } }}>
                Register
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (hamburger menu) for mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            {['Services', 'How It Works', 'Contact Us', 'FAQ', 'Login', 'Register'].map((text, index) => (
              <ListItem button key={index} component={Link} to={text === 'Register' ? '/register' : text === 'Login' ? '/login' : `/${text.toLowerCase().replace(/ /g, '-')}`}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Search Bar */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#333' }}>
          Find a Caregiver Now
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search for caregivers..."
          fullWidth
          sx={{ maxWidth: 500, mx: 'auto', mt: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}
        />
        <Button variant="contained" sx={{ ml:2,  mt: 3, backgroundColor: '#85CEA8', '&:hover': { backgroundColor: '#388e3c' }, color: '#fff' }}>
          Search
        </Button>
      </Box>

      {/* Care Seeker Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Merriweather, serif', fontWeight: 600, color: '#333' }}>
          Care Seeker Options
        </Typography>
        <Typography sx={{ maxWidth: 600, mx: 'auto', mb: 4, color: '#666' }}>
          Easily find a caregiver, explore subscription plans, or access emergency services directly from the homepage.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Link to="/caregivers">
              <Button variant="contained" fullWidth sx={{ backgroundColor: '#95d5b2', '&:hover': { backgroundColor: '#85CEA8' }, color: '#fff' }}>
                Find a Caregiver
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Link to="/subscriptions">
              <Button variant="contained" fullWidth sx={{ backgroundColor: '#95d5b2', '&:hover': { backgroundColor: '#388e3c' }, color: '#fff' }}>
                Explore Subscriptions
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Link to="/emergency-services">
              <Button variant="contained" fullWidth sx={{ backgroundColor: '#95d5b2', '&:hover': { backgroundColor: '#D8F3DC' }, color: '#fff' }}>
                Access Emergency Services
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>

      {/* Caregiver Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Merriweather, serif', fontWeight: 600, color: '#52B788' }}>
          Become a Caregiver
        </Typography>
        <Typography sx={{ maxWidth: 600, mx: 'auto', mb: 4, color: '#666' }}>
          Join CareAnn to access caregiving opportunities. Learn about our benefits, security features, and onboarding process.
        </Typography>
        <Link to="/register-caregiver">
          <Button variant="contained" sx={{ backgroundColor: '#95d5b2', '&:hover': { backgroundColor: '#388e3c' }, color: '#fff' }}>
            Become a Caregiver
          </Button>
        </Link>
      </Box>

      {/* Animated Service Tiles Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Merriweather, serif', fontWeight: 600, color: '#333' }}>
          Explore Our Services
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: expanded ? '100%' : '400px',
            height: expanded ? 'auto' : '250px',
            margin: '0 auto',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.5s ease',
            '&:hover': { boxShadow: expanded ? 'none' : '0px 5px 15px rgba(0,0,0,0.2)' },
          }}
          onClick={handleExpandClick}
        >
          {!expanded ? (
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                backgroundColor: '#f5f5f5',
                transition: 'transform 0.5s ease',
                padding: 4,
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" sx={{ fontFamily: 'Roboto, sans-serif' }}>{services[currentServiceIndex].title}</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif', color: '#666' }}>{services[currentServiceIndex].description}</Typography>
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ mt: 4 }}>
              {services.map((service, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      boxShadow: 2,
                      borderRadius: 2,
                      textAlign: 'center',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 5,
                      },
                      height: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h5" sx={{ fontFamily: 'Roboto, sans-serif', color: '#333' }}>{service.title}</Typography>
                    <Typography sx={{ color: '#666' }}>{service.description}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
          {expanded ? 'Click to collapse' : 'Click to explore all services'}
        </Typography>
      </Box>

      {/* Footer Section */}
      <Box sx={{ textAlign: 'center', py: 3, mt: 'auto' }}>
        <Typography variant="body2" sx={{ color: '#666' }}>&copy; 2024 CareAnn. All rights reserved.</Typography>
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
