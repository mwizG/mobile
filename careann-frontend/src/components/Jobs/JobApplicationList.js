import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Box,
    Paper,
    Alert,
} from '@mui/material';

function JobApplicationList() {
    const { jobId } = useParams(); // Extract jobId from the URL
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            setError(null); // Reset error state before fetching

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('User not authenticated');
                    return;
                }

                // Fetch all applications from the API
                const response = await axios.get('http://127.0.0.1:8000/api/jobs/applications/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                // Filter applications by the provided jobId (if it exists)
                const filteredApplications = jobId
                    ? response.data.filter(application => application.job === parseInt(jobId))
                    : response.data;

                setApplications(filteredApplications); // Update applications state
            } catch (error) {
                console.error('Error fetching job applications:', error);
                setError('Error fetching job applications.');
            } finally {
                setLoading(false); // Stop loading after the fetch is complete
            }
        };

        fetchApplications(); // Fetch applications when the component mounts
    }, [jobId]);

    const handleViewDetails = (applicationId) => {
        // Navigate to the JobApplicationUpdate page and pass the applicationId
        navigate(`/care-seeker/applications/${applicationId}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error" style={{ margin: '20px' }}>{error}</Alert>;
    }

    return (
        <Container sx={{ bgcolor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#4CAF50' }}>
                Job Applications
            </Typography>

            {applications.length === 0 ? (
                <Typography>No applications found for this job.</Typography>
            ) : (
                <Paper elevation={3} sx={{ padding: '16px', borderRadius: '8px' }}>
                    <List>
                        {applications.map((application) => (
                            <ListItem key={application.id} sx={{ borderBottom: '1px solid #ccc' }}>
                                <ListItemText
                                    primary={<strong>{application.job_title}</strong>}
                                    secondary={
                                        <>
                                            <Typography variant="body2"><strong>Applicant:</strong> {application.caregiver}</Typography>
                                            <Typography variant="body2"><strong>Status:</strong> {application.status}</Typography>
                                            <Box display="flex" justifyContent="flex-end" mt={1}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleViewDetails(application.id)}
                                                >
                                                    View Details
                                                </Button>
                                            </Box>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Container>
    );
}

export default JobApplicationList;
