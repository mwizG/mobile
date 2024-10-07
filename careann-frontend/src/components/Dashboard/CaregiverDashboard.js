import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, Drawer, List, ListItem, ListItemText, ListItemButton, Box, IconButton, AppBar, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger icon
import JobList from '../Jobs/JobList'; // Make sure JobList is correctly imported
import '@fontsource/roboto'; // Import custom Google font
import '@fontsource/poppins'; // Add another font for titles

function CaregiverDashboard() {
    const [applications, setApplications] = useState([]);
    const [mobileOpen, setMobileOpen] = useState(false); // State to control mobile drawer

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('accessToken'); 
                const response = await axios.get('http://127.0.0.1:8000/api/jobs/applications/', {
                    headers: {
          Authorization: `Bearer ${token}`, // Fixed formatting
        },
                });
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching job applications', error);
            }
        };

        fetchApplications();
    }, []);

    // Sidebar items
    const menuItems = [
        { text: "Search for Jobs", link: "/caregiver/search-jobs" },
        { text: "View & Manage Jobs", link: "/caregiver-jobs" },
        { text: "Manage Schedule & Availability", link: "/caregiver/schedule" },
        { text: "Task Management", link: "/caregiver/tasks" },
        { text: "Job History", link: "/caregiver/history" },
        { text: "Conversations", link: "/caregiver/conversations" },
        { text: "View & Manage Reviews", link: "/caregiver/listreviews" },
        { text: "Emergency Contacts", link: "/caregiver/emergency-contacts" },
        { text: "Settings", link: "/caregiver/settings" },
        { text: "Profile", link: "/caregiver/profile" },
        { text: "Support", link: "/Tickets" },

    ];

    // Function to handle drawer toggle for mobile view
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Sidebar Drawer Component
    const drawer = (
        <List>
            {menuItems.map((item, index) => (
                <ListItem key={index} disablePadding>
                    <ListItemButton
                        component={Link}
                        to={item.link}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#e0f2f1', // Faint green hover
                                fontWeight: 'bold',
                            },
                            fontFamily: 'Poppins, sans-serif', // Stylish font for menu items
                            fontSize: '1.1rem',
                            padding: '10px 20px',
                        }}
                    >
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* AppBar for mobile view */}
            <AppBar
                position="fixed"
                sx={{
                    display: { sm: 'none' },
                    backgroundColor: '#a5d6a7', // Faint green AppBar
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                        Caregiver Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer for mobile and desktop */}
            <Box
                component="nav"
                sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Permanent Drawer for desktop */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, backgroundColor: '#e8f5e9' }, // Faint green Drawer background
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
            >
                {/* Adding Toolbar to prevent content from hiding behind AppBar */}
                <Toolbar />
                <Typography 
                    variant="h3" 
                    gutterBottom 
                    sx={{ 
                        fontFamily: 'Poppins, sans-serif', 
                        fontWeight: 'bold', 
                        letterSpacing: '1px', 
                        color: '#388e3c' // Dark green title
                    }}>
                    Caregiver Dashboard
                </Typography>
                <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                        fontFamily: 'Roboto, sans-serif', 
                        fontSize: '1.2rem', 
                        lineHeight: '1.6', 
                        color: '#616161' // Slightly muted text color
                    }}>
                    Welcome to your dashboard. From here, you can manage all aspects of your caregiving services effectively.
                </Typography>

                {/* Job Listings as Social Media-like Posts */}
                <JobList fetchAll={false} />

                {/* Job Applications Section */}
                <Box sx={{ marginTop: 5 }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontFamily: 'Poppins, sans-serif', 
                            fontWeight: 'bold', 
                            color: '#2e7d32' // Slightly bolder green
                        }}>
                        Job Applications
                    </Typography>
                    <ul>
                        {applications.map((application) => (
                            <li key={application.id}>
                                <Link to={`/caregiver/applications/${application.job}`}>
                                    <Typography variant="body1" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', color: '#1b5e20' }}>
                                        {application.job_title}
                                    </Typography>
                                </Link>
                                <Typography variant="body2" sx={{ fontFamily: 'Roboto, sans-serif', color: '#388e3c' }}>Status: {application.status}</Typography>
                                {application.status === 'Accepted' && application.job.proposed_time && (
                                    <Typography variant="body2" sx={{ fontFamily: 'Roboto, sans-serif', color: '#388e3c' }}>
                                        Proposed Time: {new Date(application.job.proposed_time).toLocaleString()}
                                    </Typography>
                                )}
                            </li>
                        ))}
                    </ul>
                </Box>
            </Box>
        </Box>
    );
}

export default CaregiverDashboard;
