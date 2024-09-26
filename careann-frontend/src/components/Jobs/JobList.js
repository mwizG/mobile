import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, CircularProgress, Grid, Box } from '@mui/material';

function JobList({ fetchAll = false }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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

    if (loading) {
        return <CircularProgress />;
    }

    if (error || jobs.length === 0) {
        return <Typography variant="h6">No jobs found.</Typography>;
    }

    return (
        <Box className="job-list-container" sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>{fetchAll ? "All Jobs" : "Available Jobs"}</Typography>
            <Grid container spacing={3} sx={{ marginTop: 2 }}>
                {jobs.map((job) => (
                    <Grid item xs={12} sm={6} md={4} key={job.id}>
                        <Card sx={{ 
                            borderRadius: 3, // Rounded corners
                            boxShadow: 3, // Subtle shadow effect
                            transition: 'transform 0.3s', // Smooth hover effect
                            '&:hover': { 
                                transform: 'scale(1.02)', // Slightly grow on hover
                                boxShadow: 6, // Elevate the shadow on hover
                            }
                        }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{job.title}</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                                    {job.description}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Location:</strong> {job.location}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Pay Rate:</strong> K{job.pay_rate}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Status:</strong> {job.status}
                                </Typography>

                                <Button
                                    component={Link}
                                    to={`/caregiver/jobs/${job.id}`}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
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
