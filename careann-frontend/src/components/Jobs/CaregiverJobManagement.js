import { Link } from 'react-router-dom'; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    CircularProgress,
    Alert,
    IconButton,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Import an icon for better UX

const API_URL = 'http://127.0.0.1:8000/api/jobs/caregiver-jobs/';

function CaregiverJobManagement() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('accessToken'); 
                
                const response = await axios.get(API_URL, {
                    headers: {
          Authorization: `Bearer ${token}`, // Fixed formatting
        },
                });
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs', error);
                setError('Could not fetch jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container component={Paper} elevation={3} sx={{ padding: '20px', marginTop: '20px', bgcolor: '#e8f5e9' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#388e3c', fontWeight: 'bold' }}>
                My Assigned Jobs
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {jobs.length > 0 ? (
                <List>
                    {jobs.map((job) => (
                        <ListItem key={job.id} sx={{ bgcolor: '#f1f8e9', borderRadius: '8px', margin: '10px 0' }}>
                            <ListItemText>
                                <Link
                                    to={`/caregiver/jobsUp/${job.id}`}
                                    style={{ textDecoration: 'none', color: '#388e3c', display: 'flex', alignItems: 'center' }}
                                >
                                    <strong>{job.title}</strong> - {job.location} - {job.proposed_time ? new Date(job.proposed_time).toLocaleString() : 'No proposed time'}
                                    <IconButton size="small" sx={{ marginLeft: '10px', color: '#388e3c' }}>
                                        <ArrowForwardIcon fontSize="inherit" />
                                    </IconButton>
                                </Link>
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography sx={{ color: '#555' }}>No jobs found.</Typography>
            )}
        </Container>
    );
}

export default CaregiverJobManagement;
