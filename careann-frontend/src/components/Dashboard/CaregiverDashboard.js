import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, Button, Drawer, List, ListItem, ListItemText, ListItemButton, Box } from '@mui/material';
import JobList from '../Jobs/JobList'; // Make sure JobList is correctly imported

function CaregiverDashboard() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/jobs/applications/', {
                    headers: {
                        Authorization: `Token ${token}`,
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
        { text: "Manage Payments", link: "/caregiver/payments" },
        { text: "View Analytics", link: "/caregiver/analytics" },
        { text: "Learning & Resources", link: "/caregiver/resources" },
        { text: "Client Feedback", link: "/caregiver/feedback" },
        { text: "Emergency Contacts", link: "/caregiver/emergency-contacts" },
        { text: "Support & Help", link: "/caregiver/support" },
        { text: "Manage Subscriptions", link: "/caregiver/subscriptions" },
        { text: "Settings", link: "/caregiver/settings" }
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar Drawer */}
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }}
            >
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton component={Link} to={item.link}>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Caregiver Dashboard
                </Typography>
                <Typography variant="body1" paragraph>
                    Welcome to your dashboard. From here, you can manage all aspects of your caregiving services effectively.
                </Typography>

                {/* Job Listings as Social Media-like Posts */}
                <JobList fetchAll={false} />

                {/* Job Applications Section */}
                <Box sx={{ marginTop: 5 }}>
                    <Typography variant="h5">Job Applications</Typography>
                    <ul>
                        {applications.map((application) => (
                            <li key={application.id}>
                                <Link to={`/caregiver/applications/${application.job}`}>
                                    <Typography variant="body1"><strong>{application.job_title}</strong></Typography>
                                </Link>
                                <Typography variant="body2">Status: {application.status}</Typography>
                                {application.status === 'Accepted' && application.job.proposed_time && (
                                    <Typography variant="body2">
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
