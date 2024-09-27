import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';

function JobDetail() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    navigate('/login'); // Redirect to login if no token
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${jobId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
                setError('Error fetching job details.');
            }
        };

        const role = localStorage.getItem('role');
        if (role) {
            setUserRole(role);
        } else {
            console.error('User role not found');
        }

        fetchJob();
    }, [jobId, navigate]);

    const acceptJobTime = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/api/jobs/${jobId}/accept-time/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            navigate('/tasks');  // Redirect after accepting job time
        } catch (error) {
            console.error('Error accepting job time', error);
            setError('Error accepting job time.');
        }
    };

    const handleApplyClick = () => {
        navigate(`/caregiver/jobs/${jobId}/apply`);
    };

    if (!job) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100vh" 
            sx={{ backgroundColor: '#f5f5f5', padding: 4 }}
        >
            <Card sx={{ maxWidth: 600, padding: 4, borderRadius: 3, boxShadow: 6 }}>
                <CardContent>
                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ 
                            fontFamily: 'Poppins, sans-serif', 
                            fontWeight: 'bold', 
                            color: '#388e3c' 
                        }}
                    >
                        {job.title}
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif', marginBottom: 1 }}>
                        <strong>Job Type:</strong> {job.job_type}
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif', marginBottom: 1 }}>
                        <strong>Description:</strong> {job.description}
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif', marginBottom: 1 }}>
                        <strong>Location:</strong> {job.location}
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif', marginBottom: 1 }}>
                        <strong>Pay Rate:</strong> K{job.pay_rate}
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif', marginBottom: 1 }}>
                        <strong>Status:</strong> {job.status}
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif', marginBottom: 1 }}>
                        <strong>Proposed Time:</strong> {job.proposed_time ? new Date(job.proposed_time).toLocaleString() : 'N/A'}
                    </Typography>

                    {/* Conditional rendering for Caregiver actions */}
                    {userRole === 'caregiver' && (
                        <Box sx={{ mt: 2 }}>
                            {/* Accept Proposed Time Button */}
                            {job.applicatstatus === 'Accepted' && job.proposed_time && (
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ 
                                        mt: 1, 
                                        backgroundColor: '#4caf50', 
                                        '&:hover': { 
                                            backgroundColor: '#388e3c' 
                                        } 
                                    }}
                                    onClick={acceptJobTime}
                                >
                                    Accept Proposed Time
                                </Button>
                            )}

                            {/* Apply for Job Button */}
                            {job.status === 'Open' && !job.has_applied ? (
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ 
                                        mt: 2, 
                                        backgroundColor: '#81c784', 
                                        '&:hover': { 
                                            backgroundColor: '#66bb6a' 
                                        } 
                                    }}
                                    onClick={handleApplyClick}
                                >
                                    Apply for Job
                                </Button>
                            ) : (
                                job.status === 'Open' && (
                                    <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                                        You've already applied for this job.
                                    </Typography>
                                )
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default JobDetail;
