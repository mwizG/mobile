import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';

function JobListingManager() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // For navigation
    
    const currentUserId = parseInt(localStorage.getItem('user_id'), 10); // Ensure ID is an integer
    console.log("Current User ID:", currentUserId); // Debug log

    // Fetch jobs posted by the care seeker
    const fetchJobs = async () => {
        setLoading(true);
        setError(null); // Reset error state before fetching

        try {
            const token = localStorage.getItem('token');

            const response = await axios.get('http://127.0.0.1:8000/api/jobs/all-jobs/', {
                headers: {
                    Authorization: `Token ${token}`,
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
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/api/jobs/${jobId}/`, {
                headers: {
                    Authorization: `Token ${token}`,
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
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container sx={{ bgcolor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#4CAF50' }}>
                Your Posted Jobs
            </Typography>

            {/* If there are no jobs */}
            {jobs.length === 0 ? (
                <Typography>No jobs posted yet.</Typography>
            ) : (
                <Paper elevation={3} sx={{ padding: '16px', borderRadius: '8px' }}>
                    <List>
                        {jobs.map(job => (
                            <ListItem key={job.id} sx={{ borderBottom: '1px solid #ccc' }}>
                                <ListItemText
                                    primary={<strong>{job.title}</strong>}
                                    secondary={
                                        <>
                                            <Typography variant="body2">Location: {job.location}</Typography>
                                            <Box display="flex" justifyContent="space-between" mt={1}>
                                                <Button variant="contained" color="primary" onClick={() => navigate(`/care-seeker/jobs/${job.id}`)}>
                                                    View Details
                                                </Button>
                                                <Button variant="outlined" color="secondary" onClick={() => navigate(`/care-seeker/jobsUp/${job.id}`)}>
                                                    Job State Approvals
                                                </Button>
                                                <Button variant="outlined" color="warning" onClick={() => navigate(`/care-seeker/jobs/${job.id}/applications`)}>
                                                    View Applications
                                                </Button>
                                                <Button variant="outlined" color="error" onClick={() => handleDelete(job.id)}>
                                                    Delete Job
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

            {/* Button to post a new job */}
            <Box mt={2}>
                <Button variant="contained" color="success" onClick={() => navigate('/care-seeker/post-job')}>
                    Post a Job
                </Button>
            </Box>
        </Container>
    );
}

export default JobListingManager;
