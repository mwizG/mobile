// src/components/JobApplicationForm.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
} from '@mui/material';

const API_URL = `http://127.0.0.1:8000/api/jobs`;

function JobApplicationForm() {
    const { jobId } = useParams(); // Get the job ID from the URL
    const [coverLetter, setCoverLetter] = useState('');
    const [error, setError] = useState(''); // Error state for handling submission issues
    const navigate = useNavigate(); // For navigating back after submission

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken'); 
            const requestData = {
                cover_letter: coverLetter,
            };
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            // Log the request data and headers
            console.log('Request Data:', requestData);
            console.log('Headers:', headers);

            await axios.post(`${API_URL}/${jobId}/apply/`, requestData, { headers });

            // Navigate back to the caregiver dashboard after successful submission
            navigate('/caregiver/dashboard');
        } catch (error) {
            console.error('Error applying for the job:', error);
            setError('Error applying for the job. Please try again later.'); // Set error message
        }
    };

    return (
        <Container component={Paper} elevation={3} sx={{ padding: '20px', marginTop: '20px', bgcolor: '#f9f9f9' }}>
            <Typography variant="h4" gutterBottom>
                Apply for Job
            </Typography>

            {error && <Alert severity="error">{error}</Alert>} {/* Display error message */}

            <form onSubmit={handleSubmit}>
                <TextField
                    multiline
                    rows={6}
                    variant="outlined"
                    placeholder="Write your cover letter here..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{ bgcolor: '#fff' }} // White background for the textarea
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Submit Application
                </Button>
            </form>
        </Container>
    );
}

export default JobApplicationForm;
