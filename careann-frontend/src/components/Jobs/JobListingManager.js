import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    CircularProgress,
    Box,
    Paper,
    Grid,
} from '@mui/material';

function JobListingManager() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const currentUserId = parseInt(localStorage.getItem('user_id'), 10);
    console.log("Current User ID:", currentUserId); // Debug log

    // Fetch jobs posted by the care seeker
    const fetchJobs = async () => {
        setLoading(true);
        setError(null); // Reset error state before fetching

        try {
            const token = localStorage.getItem('accessToken');

            const response = await axios.get('http://127.0.0.1:8000/api/jobs/all-jobs/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Jobs received:", response.data); // Log the jobs received from the API

            // Filter the jobs to only include those posted by the current care seeker
            if (currentUserId) {
                const filteredJobs = response.data.filter(job => job.care_seeker.id === currentUserId);
                setJobs(filteredJobs); // Update jobs state with filtered data
            } else {
                console.error("User ID is null. Cannot filter jobs.");
                setJobs([]); // Set jobs to an empty array if user ID is missing
            }
        } catch (error) {
            setError('Error fetching jobs.');
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false); // Stop loading after the fetch is complete
        }
    };

    // Fetch jobs when the component mounts
    useEffect(() => {
        fetchJobs();
    }, []);

    // Handle job deletion
    const handleDelete = async (jobId) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`http://127.0.0.1:8000/api/jobs/${jobId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Remove job from local state after successful deletion
            setJobs(jobs.filter(job => job.id !== jobId));
        } catch (error) {
            console.error('Error deleting job:', error);
            setError('Failed to delete the job.');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error" align="center">{error}</Typography>;
    }

    return (
        <Container sx={{ bgcolor: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#4CAF50', textAlign: 'center' }}>
                Your Posted Jobs
            </Typography>

            {/* If there are no jobs */}
            {jobs.length === 0 ? (
                <Typography variant="body1" align="center">No jobs posted yet.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {jobs.map(job => (
                        <Grid item xs={12} sm={6} md={4} key={job.id}>
                            <Paper elevation={3} sx={{ padding: '16px', borderRadius: '8px', height: '100%' }}>
                                <Typography variant="h6" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>{job.title}</Typography>
                                <Typography variant="body2" color="text.secondary">Location: {job.location}</Typography>
                                <Box display="flex" flexDirection="column" mt={2} gap={1}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate(`/care-seeker/jobs/${job.id}`)}
                                        sx={{ flexGrow: 1, fontSize: { xs: '0.75rem', sm: '1rem' } }} // Responsive font size
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => navigate(`/care-seeker/jobsUp/${job.id}`)}
                                        sx={{ flexGrow: 1, fontSize: { xs: '0.75rem', sm: '1rem' } }} // Responsive font size
                                    >
                                        Job State Approvals
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        onClick={() => navigate(`/care-seeker/jobs/${job.id}/applications`)}
                                        sx={{ flexGrow: 1, fontSize: { xs: '0.75rem', sm: '1rem' } }} // Responsive font size
                                    >
                                        View Applications
                                    </Button>
                                    {job.status !=='In Progress' &&(
                                        <>
                                        <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(job.id)}
                                        sx={{ flexGrow: 1, fontSize: { xs: '0.75rem', sm: '1rem' } }} // Responsive font size
                                    >
                                        Delete Job
                                    </Button>

                                        </>
                                    )

                                    }
                                    
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Button to post a new job */}
            <Box mt={2} display="flex" justifyContent="center">
                <Button variant="contained" color="success" onClick={() => navigate('/care-seeker/post-job')}>
                    Post a Job
                </Button>
                
            </Box>
            <Box mt={2} display="flex" justifyContent="center">
                
                <Button variant="contained" color="#1A43BF" onClick={() => navigate('/care-seeker/dashboard')}>
                    back
                </Button>
            </Box>
        </Container>
    );
}

export default JobListingManager;
