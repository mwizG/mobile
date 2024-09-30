import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Grid, Paper, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger menu icon
import '@fontsource/roboto'; // Import custom Google font
import '@fontsource/poppins'; // Add another font for titles

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

function CareSeekerDashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false); // State for the drawer (hamburger menu)

    // Toggle the drawer (hamburger menu)
    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Top Navigation Bar */}
            <AppBar position="fixed" sx={{ backgroundColor: '#a5d6a7' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontFamily: 'Poppins, sans-serif' }}>
                        Care Seeker Dashboard
                    </Typography>
                    {/* Hamburger Menu Icon for small screens */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                        sx={{ display: { xs: 'block', md: 'none' } }} // Show only on small screens
                    >
                        <MenuIcon />
                    </IconButton>
                    {/* Desktop navigation */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        <Link to="/care-seeker/search">
                            <Button color="inherit">Search for Caregivers</Button>
                        </Link>
                        <Link to="/care-seeker/post-job">
                            <Button color="inherit">Post a Job</Button>
                        </Link>
                        <Link to="/care-seeker/jobs">
                            <Button color="inherit">View & Manage Job Listings</Button>
                        </Link>
                        <Link to="/care-seeker/caregiverlist">
                            <Button color="inherit">Caregivers</Button>
                        </Link>
                        <Link to="/care-seeker/conversations">
                            <Button color="inherit">Conversations</Button>
                        </Link>
                        <Link to="/care-seeker/payments">
                            <Button color="inherit">Manage Payments</Button>
                        </Link>
                        <Link to="/care-seeker/schedule">
                            <Button color="inherit">Manage Schedule</Button>
                        </Link>
                        <Link to="/care-seeker/profile">
                            <Button color="inherit">Profile Management</Button>
                        </Link>
                        <Link to="/care-seeker/settings">
                            <Button color="inherit">Settings</Button>
                        </Link>

                        <Link to="//Tickets">
                            <Button color="inherit">Support</Button>
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
                        <Link to="/care-seeker/search"><ListItem button><ListItemText primary="Search for Caregivers" /></ListItem></Link>
                        <Link to="/care-seeker/post-job"><ListItem button><ListItemText primary="Post a Job" /></ListItem></Link>
                        <Link to="/care-seeker/jobs"><ListItem button><ListItemText primary="View & Manage Job Listings" /></ListItem></Link>
                        <Link to="/care-seeker/caregiverlist"><ListItem button><ListItemText primary="Caregivers" /></ListItem></Link>
                        <Link to="/care-seeker/conversations"><ListItem button><ListItemText primary="Conversations" /></ListItem></Link>
                        <Link to="/care-seeker/payments"><ListItem button><ListItemText primary="Manage Payments" /></ListItem></Link>
                        <Link to="/care-seeker/schedule"><ListItem button><ListItemText primary="Manage Schedule" /></ListItem></Link>
                        <Link to="/care-seeker/profile"><ListItem button><ListItemText primary="Profile Management" /></ListItem></Link>
                        <Link to="/care-seeker/settings"><ListItem button><ListItemText primary="Settings" /></ListItem></Link>
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: 8 }}>
                <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', color: '#388e3c' }}>
                    Welcome to your dashboard
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontFamily: 'Roboto, sans-serif', lineHeight: '1.6', color: '#616161' }}>
                    From here, you can manage your care needs effectively.
                </Typography>

                {/* Care Type Tiles */}
                <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', color: '#388e3c' }}>
                    Find Caregivers
                </Typography>
                <Grid container spacing={2}>
                    {services.map((service, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', cursor: 'pointer' }}>
                                <Link to={`/care-seeker/caregiverlist/${service.title.toLowerCase().replace(/ /g, '-')}`}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                                        {service.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#616161' }}>
                                        {service.description}
                                    </Typography>
                                </Link>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default CareSeekerDashboard;
