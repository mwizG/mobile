import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgress, Grid, Box, Typography, Button, Paper } from '@mui/material';
import '@fontsource/poppins'; // Import for creative typography
import '@fontsource/roboto';  // Additional font for body text

function JobList({ fetchAll = false }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate(); // Added useNavigate hook to navigate to profiles

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    throw new Error('No access token found.');
                }

                const endpoint = fetchAll 
                    ? 'http://127.0.0.1:8000/api/jobs/all-jobs/'  // Fetch all jobs
                    : 'http://127.0.0.1:8000/api/jobs/open-jobs/';
                    
                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setJobs(response.data);
            } catch (err) {
                const errorMessage = err.response 
                    ? `Error fetching jobs: ${err.response.data.detail || err.message}` 
                    : `Error fetching jobs: ${err.message}`;
                setError(errorMessage);
            } finally {
                setLoading(false); // Ensure loading is set to false regardless of the outcome
            }
        };

        fetchJobs();
    }, [fetchAll]); // Added fetchAll as a dependency if it can change

    const goToCareseekerProfile = (careSeekerId) => {
        if (careSeekerId) {
            navigate(`/careseeker/${careSeekerId}`);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error || jobs.length === 0) {
        return <Typography variant="h6" color="error" textAlign="center">No jobs found.</Typography>;
    }

    return (
        <Box className="job-list-container" sx={{ padding: 3, backgroundColor: '#f0f4f8' }}>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    fontFamily: 'Poppins, sans-serif', 
                    fontWeight: 'bold', 
                    color: '#388e3c',
                    textAlign: 'center' 
                }}
            >
                {fetchAll ? "All Jobs" : "Available Jobs"}
            </Typography>
            <Grid container spacing={4}>
                {jobs.map((job) => (
                    <Grid item xs={12} sm={6} md={4} key={job.id}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                borderRadius: 2, 
                                padding: 2, 
                                backgroundColor: '#ffffff', 
                                transition: '0.3s',
                                '&:hover': { 
                                    boxShadow: 10, 
                                    transform: 'translateY(-5px)', 
                                }
                            }}
                        >
                            <Typography 
                                variant="h5" 
                                gutterBottom 
                                sx={{ 
                                    fontFamily: 'Poppins, sans-serif', 
                                    fontWeight: 'bold', 
                                    color: '#2e7d32',
                                    letterSpacing: '0.5px',
                                    textAlign: 'center' // Center align title
                                }}
                            >
                                {job.title}
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    fontFamily: 'Roboto, sans-serif', 
                                    color: '#555555', 
                                    mb: 2,
                                    textAlign: 'left',
                                    lineHeight: 1.5,
                                }}
                            >
                                <strong>Posted by:</strong>{' '}
                                <span 
                                    className="careseeker-link" 
                                    style={{ 
                                        color: '#1976d2', 
                                        cursor: 'pointer' 
                                    }} 
                                    onClick={() => goToCareseekerProfile(job.care_seeker?.id)}
                                >
                                    {job.care_seeker?.username || 'N/A'}
                                </span>
                            </Typography>

                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontFamily: 'Roboto, sans-serif', 
                                    color: '#616161', 
                                    mb: 1,
                                    textAlign: 'left',
                                    fontStyle: 'italic',
                                }}
                            >
                                <strong>Job Type:</strong> {job.job_type}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontFamily: 'Roboto, sans-serif', 
                                    color: '#616161', 
                                    mb: 1,
                                    textAlign: 'left',
                                }}
                            >
                                <strong>Description:</strong> {job.description}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontFamily: 'Roboto, sans-serif', 
                                    color: '#616161', 
                                    mb: 1,
                                    textAlign: 'left',
                                }}
                            >
                                <strong>Location:</strong> {job.location}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontFamily: 'Roboto, sans-serif', 
                                    color: '#616161', 
                                    mb: 1,
                                    textAlign: 'left',
                                }}
                            >
                                <strong>Pay Rate:</strong> K{job.pay_rate}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontFamily: 'Roboto, sans-serif', 
                                    color: '#616161', 
                                    mb: 2,
                                    textAlign: 'left',
                                }}
                            >
                                <strong>Status:</strong> {job.status}
                            </Typography>

                            <Button
                                component={Link}
                                to={`/caregiver/jobs/${job.id}`}
                                variant="contained"
                                fullWidth
                                sx={{ 
                                    mt: 2, 
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 'bold',
                                    backgroundColor: '#4caf50',
                                    '&:hover': { 
                                        backgroundColor: '#388e3c' 
                                    },
                                    color: '#ffffff',
                                }}
                            >
                                View Job
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default JobList;
