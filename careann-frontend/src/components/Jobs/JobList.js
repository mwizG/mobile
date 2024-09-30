import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, CircularProgress, Grid, Box } from '@mui/material';
import '@fontsource/poppins'; // Import for creative typography
import '@fontsource/roboto';  // Additional font for body text

function JobList({ fetchAll = false }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate(); // Added useNavigate hook to navigate to profiles

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const endpoint = fetchAll 
                    ? 'http://127.0.0.1:8000/api/jobs/all-jobs/'  // Fetch all jobs
                    : 'http://127.0.0.1:8000/api/jobs/open-jobs/'; // Fetch only open jobs

                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });

                setJobs(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setError(true);
                setLoading(false);
            }
        };
        fetchJobs();
    }, [fetchAll]);

    const goToCareseekerProfile = (careSeekerId) => {
        if (careSeekerId) {
            navigate(`/careseeker/${careSeekerId}`);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error || jobs.length === 0) {
        return <Typography variant="h6">No jobs found.</Typography>;
    }

    return (
        <Box className="job-list-container" sx={{ padding: 3 }}>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    fontFamily: 'Poppins, sans-serif', 
                    fontWeight: 'bold', 
                    color: '#388e3c' 
                }}
            >
                {fetchAll ? "All Jobs" : "Available Jobs"}
            </Typography>
            <Grid container spacing={3} sx={{ marginTop: 2 }}>
                {jobs.map((job) => (
                    <Grid item xs={12} sm={6} md={4} key={job.id}>
                        <Card sx={{ 
                            borderRadius: 3, 
                            boxShadow: 3, 
                            transition: 'transform 0.3s', 
                            backgroundColor: '#e8f5e9', 
                            '&:hover': { 
                                transform: 'scale(1.03)', 
                                boxShadow: 6, 
                                backgroundColor: '#c8e6c9', 
                            }
                        }}>
                            <CardContent>
                                <Typography 
                                    variant="h5" 
                                    gutterBottom 
                                    sx={{ 
                                        fontFamily: 'Poppins, sans-serif', 
                                        fontWeight: '600', 
                                        color: '#2e7d32',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    {job.title}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        fontFamily: 'Roboto, sans-serif', 
                                        color: '#616161', 
                                        mb: 1, // Shortened marginBottom syntax
                                        display: 'flex', 
                                        alignItems: 'center' 
                                    }}
                                >
                                    <strong>Posted by:</strong>{' '}
                                    <span 
                                        className="careseeker-link" 
                                        style={{ 
                                            color: 'blue', 
                                            cursor: 'pointer', 
                                            marginLeft: '4px'  // Added spacing between "Posted by:" and the username
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
                                        marginBottom: 1 
                                    }}
                                >
                                    {job.job_type}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        fontFamily: 'Roboto, sans-serif', 
                                        color: '#616161', 
                                        marginBottom: 1 
                                    }}
                                >
                                    {job.description}
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        fontFamily: 'Roboto, sans-serif', 
                                        marginBottom: '0.5rem' 
                                    }}
                                >
                                    <strong>Location:</strong> {job.location}
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        fontFamily: 'Roboto, sans-serif', 
                                        marginBottom: '0.5rem' 
                                    }}
                                >
                                    <strong>Pay Rate:</strong> K{job.pay_rate}
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        fontFamily: 'Roboto, sans-serif', 
                                        marginBottom: '0.5rem' 
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
                                        letterSpacing: '0.3px',
                                        backgroundColor: '#81c784',
                                        '&:hover': { 
                                            backgroundColor: '#66bb6a'
                                        }
                                    }}
                                >
                                    View Job
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default JobList;
