// src/components/JobApplicationDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Alert,
    Paper,
    Box,
} from '@mui/material';

const API_URL = 'http://127.0.0.1:8000/api/jobs/';

function JobApplicationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [application, setApplication] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobAndApplication = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found. Please log in.');
                    return;
                }

                // Fetch job details
                const jobResponse = await axios.get(`${API_URL}${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setJob(jobResponse.data);

                // Fetch applications for this job
                const applicationResponse = await axios.get(`${API_URL}${id}/applications/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                // Fetch logged-in user's ID
                const userResponse = await axios.get('http://127.0.0.1:8000/api/accounts/profile', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                const loggedInUserId = userResponse.data.id;

                // Find current application
                const currentApplication = applicationResponse.data.find(app => app.caregiver_id === loggedInUserId);
                if (currentApplication) {
                    setApplication(currentApplication);
                } else {
                    setError('No accepted application found for this job.');
                }
            } catch (error) {
                setError('Error fetching job or application details');
                console.error('Error fetching job or application details:', error);
            }
        };

        const role = localStorage.getItem('role');
        if (role) {
            setUserRole(role);
        } else {
            console.error('User role not found');
        }

        fetchJobAndApplication();
    }, [id]);

    const handleAcceptJobTime = async () => {
        if (!job || !job.proposed_time) {
            setError('Proposed time not found. Cannot accept the job.');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            
            // Create the payload with proposed time as both scheduled_time and accepted_time
            const payload = {
                scheduled_time: job.proposed_time,
                accepted_time: job.proposed_time,
            };
    
            // Send the PATCH request to accept the job with scheduled_time and accepted_time
            await axios.patch(`${API_URL}${id}/accept/`, payload, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
    
            alert('Job accepted successfully!');
            navigate('/caregiver-jobs');
        } catch (error) {
            if (error.response && error.response.data.error) {
                setError(error.response.data.error);  // Set the error message from the response
            } else {
                setError('Error accepting the job');
            }
            console.error('Error accepting the job:', error);
        }
    };

    const handleDeclineJob = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}${id}/decline/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            alert('Job declined successfully!');
            navigate('/caregiver-jobs');
        } catch (error) {
            setError('Error declining the job');
            console.error('Error declining the job:', error);
        }
    };

    if (!job || !application) {
        return <div>Loading job and application details...</div>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Container component={Paper} elevation={3} sx={{ padding: '20px', borderRadius: '8px', bgcolor: '#f9f9f9' }}>
            <Typography variant="h4" gutterBottom>
                {job.title}
            </Typography>
            <Typography variant="h6">
                <strong>Description:</strong> {job.description}
            </Typography>
            <Typography variant="body1">
                <strong>Location:</strong> {job.location}
            </Typography>
            <Typography variant="body1">
                <strong>Pay Rate:</strong> K{job.pay_rate}
            </Typography>
            <Typography variant="body1">
                <strong>Application Status:</strong> {application.status}
            </Typography>
            <Typography variant="body1">
                <strong>Proposed Time:</strong> {job.proposed_time ? new Date(job.proposed_time).toLocaleString() : 'No proposed time'}
            </Typography>

            <Box mt={3}>
                {userRole === 'caregiver' && application.status === 'Accepted' && job.status !== 'In Progress' && (
                    <>
                        <Button variant="contained" color="primary" onClick={handleAcceptJobTime} sx={{ mr: 2 }}>
                            Accept Job
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleDeclineJob}>
                            Decline Job
                        </Button>
                    </>
                )}
            </Box>
        </Container>
    );
}

export default JobApplicationDetail;
