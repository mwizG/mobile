import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Grid } from '@mui/material';
import '@fontsource/roboto'; // Import custom Google font
import '@fontsource/poppins'; // Add another font for titles

function CareSeekerDashboard() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Top Navigation Bar */}
            <AppBar position="fixed" sx={{ backgroundColor: '#a5d6a7' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontFamily: 'Poppins, sans-serif' }}>
                        Care Seeker Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

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
                    <Grid item xs={12} sm={4}>
                        <Link to="/care-seeker/care-type/elderly">
                            <Button variant="contained" sx={{ width: '100%', backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Elderly Care
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Link to="/care-seeker/care-type/disability">
                            <Button variant="contained" sx={{ width: '100%', backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Disability Support
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Link to="/care-seeker/care-type/childcare">
                            <Button variant="contained" sx={{ width: '100%', backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Childcare
                            </Button>
                        </Link>
                    </Grid>
                    {/* Add more care types as needed */}
                </Grid>

                {/* Sidebar Options */}
                <Box sx={{ marginTop: 5 }}>
                    <Typography variant="h5" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', color: '#2e7d32' }}>
                        Manage Your Needs
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                        <Link to="/care-seeker/search">
                            <Button variant="contained" sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Search for Caregivers
                            </Button>
                        </Link>
                        <Link to="/care-seeker/post-job">
                            <Button variant="contained" sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Post a Job
                            </Button>
                        </Link>
                        <Link to="/care-seeker/jobs">
                            <Button variant="contained" sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                View & Manage Job Listings
                            </Button>
                        </Link>
                        <Link to="/care-seeker/caregiverlist">
                            <Button variant="contained" sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Caregivers
                            </Button>
                        </Link>
                        <Link to="/care-seeker/conversations">
                            <Button variant="contained" sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Conversations
                            </Button>
                        </Link>
                        <Link to="/care-seeker/payments">
                            <Button variant="contained" sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Manage Payments
                            </Button>
                        </Link>
                        <Link to="/caregiver/listreviews">
                            <Button variant="contained" sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Manage Reviews
                            </Button>
                        </Link>
                        <Link to="/care-seeker/schedule">
                            <Button variant="contained" sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Manage Schedule
                            </Button>
                        </Link>
                        <Link to="/care-seeker/emergency-services">
                            <Button variant="contained" sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Emergency Services
                            </Button>
                        </Link>
                        <Link to="/care-seeker/profile">
                            <Button variant="contained" sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Profile Management
                            </Button>
                        </Link>
                        <Link to="/care-seeker/settings">
                            <Button variant="contained" sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#2e7d32' } }}>
                                Settings
                            </Button>
                        </Link>
                    </Box>
                </Box>

                {/* Notifications Section */}
                <Box sx={{ marginTop: 5 }}>
                    <Typography variant="h5" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', color: '#2e7d32' }}>
                        Notifications
                    </Typography>
                    <ul>
                        <li>You have 3 new messages from caregivers.</li>
                        <li>Your job posting "Elderly Care Needed" received 5 applications.</li>
                    </ul>
                </Box>
            </Box>
        </Box>
    );
}

export default CareSeekerDashboard;
