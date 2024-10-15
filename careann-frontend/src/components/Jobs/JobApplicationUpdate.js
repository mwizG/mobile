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
        fetchApplication();
    }, [pk]);

    const fetchApplication = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const role = localStorage.getItem('role');
            setUserRole(role);

            const appResponse = await axios.get(`${API_URL}/applications/${pk}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplication(appResponse.data);
            setStatus(appResponse.data.status);

            const jobResponse = await axios.get(`${API_URL}/${appResponse.data.job}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJob(jobResponse.data);
        } catch (err) {
            handleError(err, 'fetching application or job details');
        }
    };

    const handleError = (error, action) => {
        console.error(`Error ${action}`, error);
        setError(`Error ${action}.`);
    };

    const updateApplicationStatus = async (newStatus) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(`${API_URL}/applications/${pk}/`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStatus(newStatus);
        } catch (error) {
            handleError(error, 'updating job application status');
        }
    };

    const proposeTimeUpdate = async () => {
        const proposedTime = proposeNewTime ? newProposedTime : job.proposed_time;

        try {
            const token = localStorage.getItem('accessToken');

            // Update the proposed time
            await axios.patch(`${API_URL}/${application.job}/propose-time/`, 
                { proposed_time: proposedTime }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Reset the job status to "Open" only if it is currently "Declined"
            if (job.status === 'Declined') {
                await axios.patch(`${API_URL}/${application.job}/`, 
                    { status: 'Open' }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            // Fetch the updated job details
            const updatedJobResponse = await axios.get(`${API_URL}/${application.job}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setJob(updatedJobResponse.data);
            alert("Job time updated!" + (job.status === 'Declined' ? " Status reset to Open!" : ""));
        } catch (error) {
            handleError(error, 'updating proposed time and resetting job status');
        }
    };

    const resetJobStatusToOpen = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(`${API_URL}/${application.job}/`, 
                { status: 'Open' }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // Fetch the updated job details after resetting status
            const updatedJobResponse = await axios.get(`${API_URL}/${application.job}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            setJob(updatedJobResponse.data);
            alert("Job status reset to Open!");
        } catch (error) {
            handleError(error, 'resetting job status to Open');
        }
    };
    

    const goToCaregiverProfile = () => {
        if (application?.caregiver_id) {
            navigate(`/caregiver/${application.caregiver_id}`);
        }
    };

    const startConversation = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const caregiverUsername = application.caregiver;

            const conversationsResponse = await axios.get('http://127.0.0.1:8000/api/messaging/conversations/', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const existingConversation = conversationsResponse.data.find(conversation =>
                conversation.participants.includes(caregiverUsername)
            );

            if (existingConversation) {
                navigate(`/conversations/${existingConversation.id}/messages`);
            } else {
                const response = await axios.post('http://127.0.0.1:8000/api/messaging/conversations/', {
                    participants: [caregiverUsername],
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                navigate(`/conversations/${response.data.id}/messages`);
            }
        } catch (error) {
            handleError(error, 'starting conversation');
        }
    };

    if (!application || !job) {
        return <div>Loading application or job details...</div>;
    }

    return (
        <Container component={Paper} elevation={3} sx={{ padding: '30px', borderRadius: '12px', bgcolor: '#f9f9f9' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
                Update Job Application
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}

            <Divider sx={{ margin: '20px 0' }} />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#555' }}>Job: {job.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        <strong>Caregiver:</strong>{' '}
                        <span 
                            className="caregiver-link" 
                            style={{ color: '#007bbf', cursor: 'pointer', textDecoration: 'underline' }} 
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

                <Grid item xs={12}>
                   {job.status === 'Declined' && (
                    <Typography variant="body1">
                        <strong>Applicant response:</strong> {job.status}
                    </Typography>
                    )}
                    <Typography variant="body1">
                    <strong>Job status:</strong> {job.status}
                    </Typography>

                    <Typography variant="body1">
                    <strong>application status:</strong> {status}
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ margin: '20px 0' }} />
            {job.status === 'Open' &&(
                <>
                <Typography variant="body1"><strong>Status:</strong></Typography>
                <Select value={status} onChange={(e) => updateApplicationStatus(e.target.value)} fullWidth variant="outlined">
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
                
                </>
            
              )}
            {job.status === 'Declined' && (
            <Button 
                variant="contained" 
                onClick={resetJobStatusToOpen}
                sx={{ mt: 2, bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' }}}
            >
                Reset to Open
            </Button>
             )}

            

            {status === 'Accepted' && job.status === 'Open' &&(
                <>
                    <Divider sx={{ margin: '20px 0' }} />
                    <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>Propose Job Time</Typography>
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
                            variant="outlined"
                        />
                    )}

                    <Button 
                        variant="contained" 
                        onClick={proposeTimeUpdate} 
                        sx={{ mt: 2, bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' }}}
                    >
                        {proposeNewTime ? "Propose New Time" : "Confirm Time"}
                    </Button>
                </>
            )}

            <Divider sx={{ margin: '20px 0' }} />
            <Button 
                variant="contained" 
                color="primary" 
                onClick={startConversation} 
                sx={{ mt: 2 }}
            >
                Start Conversation with Caregiver
            </Button>
        </Container>
    );
};

export default JobApplicationUpdate;
