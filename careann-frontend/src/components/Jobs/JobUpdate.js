import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Paper,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from '@mui/material';

const API_URL = 'http://127.0.0.1:8000/api/jobs/';

function JobUpdate() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true); // For loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const token = localStorage.getItem('accessToken'); 
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${API_URL}${jobId}/`, {
                    headers: {
          Authorization: `Bearer ${token}`, // Fixed formatting
        },
                });
                setJob(response.data);
                setStatus(response.data.status);
            } catch (error) {
                setError('Error fetching job details.');
            } finally {
                setLoading(false);
            }
        };

        const role = localStorage.getItem('role');
        setUserRole(role);

        fetchJob();
    }, [jobId, navigate]);

    const completeJob = async () => {
        try {
            const token = localStorage.getItem('accessToken'); 
            await axios.patch(`${API_URL}${jobId}/update-status/`, { status: 'Awaiting Approval' }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStatus('Awaiting Approval');
            alert('Job status updated to "Awaiting Approval". Awaiting care seeker approval.');
        } catch (error) {
            setError('Error updating job status.');
        }
    };

    const updateSeekerStatus = async (newStatus) => {
        try {
            const token = localStorage.getItem('accessToken'); 
            await axios.patch(`${API_URL}${jobId}/approve-completion/`, { status: newStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (newStatus === 'Completed') {
                navigate(`/jobs/${jobId}/review-caregiver`);
            } else if (newStatus === 'In Progress') {
                setStatus('In Progress');
            }
        } catch (error) {
            setError('Error approving or rejecting job status.');
        }
    };

    const redirectToReviewCaregiver = () => {
        navigate(`/jobs/${jobId}/review-caregiver`);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container component={Paper} elevation={3} sx={{ padding: '20px', bgcolor: '#f9f9f9' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#388e3c' }}>
                Job Details: {job.title}
            </Typography>
            <Typography variant="h6">Description:</Typography>
            <Typography>{job.description}</Typography>
            <Typography variant="h6">Status:</Typography>
            <Typography sx={{ fontWeight: 'bold', color: '#388e3c' }}>{status}</Typography>

            {userRole === 'caregiver' && job.status !== 'Completed' && job.status !== 'Awaiting Approval' && (
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={completeJob}
                    sx={{ marginTop: '20px' }}
                >
                    Complete Job
                </Button>
            )}

            {userRole === 'care_seeker' && job.status === 'Awaiting Approval' && (
                <FormControl variant="outlined" fullWidth sx={{ marginTop: '20px' }}>
                    <InputLabel>Approve or Reject Completion</InputLabel>
                    <Select
                        value={status}
                        onChange={(e) => updateSeekerStatus(e.target.value)}
                        label="Approve or Reject Completion"
                    >
                        <MenuItem value="non">-----</MenuItem>
                        <MenuItem value="Completed">Approve (Completed)</MenuItem>
                        <MenuItem value="In Progress">Reject (In Progress)</MenuItem>
                    </Select>
                </FormControl>
            )}

            {userRole === 'care_seeker' && job.status === 'Completed' && (
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={redirectToReviewCaregiver}
                    sx={{ marginTop: '20px' }}
                >
                    Review Caregiver
                </Button>
            )}
        </Container>
    );
}

export default JobUpdate;
