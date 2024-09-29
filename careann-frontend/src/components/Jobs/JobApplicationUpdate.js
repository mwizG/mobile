import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    Alert,
    Box,
    Checkbox,
    FormControlLabel,
    Paper,
    Divider,
    Grid,
} from '@mui/material';

const API_URL = 'http://127.0.0.1:8000/api/jobs';

const JobApplicationUpdate = () => {
    const { pk } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [job, setJob] = useState(null);
    const [status, setStatus] = useState('Pending');
    const [proposeNewTime, setProposeNewTime] = useState(false);
    const [newProposedTime, setNewProposedTime] = useState('');
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const token = localStorage.getItem('token');
                const role = localStorage.getItem('role');
                setUserRole(role);

                const appResponse = await axios.get(`${API_URL}/applications/${pk}/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setApplication(appResponse.data);
                setStatus(appResponse.data.status);

                const jobResponse = await axios.get(`${API_URL}/${appResponse.data.job}/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setJob(jobResponse.data);
            } catch (err) {
                handleError(err, 'fetching application or job details');
            }
        };

        fetchApplication();
    }, [pk]);

    const handleError = (error, action) => {
        console.error(`Error ${action}`, error);
        setError(`Error ${action}.`);
    };

    const updateApplicationStatus = async (newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/applications/${pk}/`, { status: newStatus }, {
                headers: { Authorization: `Token ${token}` },
            });
            setStatus(newStatus);
        } catch (error) {
            handleError(error, 'updating job application status');
        }
    };

    const proposeTimeUpdate = async () => {
        const proposedTime = proposeNewTime ? newProposedTime : job.proposed_time;
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/${application.job}/propose-time/`, { proposed_time: proposedTime }, {
                headers: { Authorization: `Token ${token}` },
            });
            alert("Job time updated successfully!");
        } catch (error) {
            handleError(error, 'updating proposed time');
        }
    };

    const handleAcceptJobTime = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/${job.id}/accept-time/`, {}, {
                headers: { Authorization: `Token ${token}` },
            });
            alert("Job time accepted successfully!");
        } catch (error) {
            handleError(error, 'accepting the job time');
        }
    };

    const handleDeclineJob = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/${job.id}/decline/`, {}, {
                headers: { Authorization: `Token ${token}` },
            });
            alert("Job declined successfully!");
        } catch (error) {
            handleError(error, 'declining the job');
        }
    };

    const goToCaregiverProfile = () => {
        if (application?.caregiver_id) {
            navigate(`/caregiver/${application.caregiver_id}`);
        }
    };

    if (!application || !job) {
        return <div>Loading application or job details...</div>;
    }

    return (
        <Container component={Paper} elevation={3} sx={{ padding: '30px', borderRadius: '12px', bgcolor: '#f9f9f9' }}>
            <Typography variant="h4" gutterBottom align="center">
                Update Job Application
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}

            <Divider sx={{ margin: '20px 0' }} />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">Job: {job.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        <strong>Caregiver:</strong>{' '}
                        <span 
                            className="caregiver-link" 
                            style={{ color: 'blue', cursor: 'pointer' }} 
                            onClick={goToCaregiverProfile}
                        >
                            {application.caregiver || 'N/A'}
                        </span>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>Cover Letter:</strong> {application.cover_letter}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>Applied At:</strong> {new Date(application.applied_at).toLocaleDateString()}
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ margin: '20px 0' }} />

            <Typography variant="body1"><strong>Status:</strong></Typography>
            <Select value={status} onChange={(e) => updateApplicationStatus(e.target.value)} fullWidth>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>

            {status === 'Accepted' && (
                <>
                    <Divider sx={{ margin: '20px 0' }} />
                    <Typography variant="h6" sx={{ mt: 3 }}>Propose Job Time</Typography>
                    <Typography variant="body1"><strong>Current Proposed Time:</strong> {new Date(job.proposed_time).toLocaleString()}</Typography>
                    
                    <FormControlLabel
                        control={<Checkbox checked={proposeNewTime} onChange={(e) => setProposeNewTime(e.target.checked)} />}
                        label="Propose a new time"
                    />

                    {proposeNewTime && (
                        <TextField
                            type="datetime-local"
                            value={newProposedTime}
                            onChange={(e) => setNewProposedTime(e.target.value)}
                            fullWidth
                            sx={{ marginTop: '10px' }}
                        />
                    )}

                    <Button 
                        variant="contained" 
                        onClick={proposeTimeUpdate} 
                        sx={{ mt: 2, bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' }}}
                    >
                        {proposeNewTime ? "Propose New Time" : "Keep Current Time"}
                    </Button>

                    {userRole === 'caregiver' && (
                        <Box sx={{ mt: 2 }}>
                            <Button 
                                variant="contained" 
                                onClick={handleAcceptJobTime} 
                                sx={{ mr: 2, bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' }}}
                            >
                                Accept Job Time
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                onClick={handleDeclineJob}
                            >
                                Decline Job
                            </Button>
                        </Box>
                    )}
                </>
            )}

            <Button 
                variant="outlined" 
                onClick={() => navigate(-1)} 
                sx={{ ml: 2, mt: 2, borderColor: '#4caf50', color: '#4caf50', '&:hover': { borderColor: '#45a049', color: '#45a049' }}}
            >
                Go Back
            </Button>
        </Container>
    );
};

export default JobApplicationUpdate;
