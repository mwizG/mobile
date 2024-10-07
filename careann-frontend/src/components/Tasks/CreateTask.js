import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Paper } from '@mui/material';

function CreateTask() {
    const [description, setDescription] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [jobId, setJobId] = useState('');  // Task must be tied to a job
    const [jobs, setJobs] = useState([]);  // List of accepted jobs for dropdown
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch accepted jobs when the component loads
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('accessToken'); 
                const response = await axios.get('http://127.0.0.1:8000/api/jobs/caregiver-jobs/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setJobs(response.data);  // Set the jobs for the dropdown
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setError('Failed to load jobs. Please try again.');
            }
        };

        fetchJobs();
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault(); // Prevent page refresh
    
        // Check the jobId being sent
        console.log('Selected Job ID:', jobId);  // Log the job ID
    
        const payload = {
            job: jobId,  // The selected job ID
            description: description,
            scheduled_time: scheduledTime,
        };
    
        try {
            const token = localStorage.getItem('accessToken'); 
            const response = await axios.post('http://127.0.0.1:8000/api/jobs/tasks/create/', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log('Task created successfully:', response.data);
            navigate('/tasks');
        } catch (error) {
            console.error('Error creating task:', error);
            if (error.response && error.response.status === 400) {
                // Assuming the error response follows a standard format for validation errors
                const errors = error.response.data; 
                const errorMessages = Object.values(errors).flat().join(', '); // Flatten error messages
                setError(errorMessages || "Invalid input data. Please check the fields.");
            } else {
                setError("An error occurred while creating the task.");
            }
        }
    };
    const handleBack = () => {
        navigate('/tasks');  // Back to the task management page/caregiver/dashboard
    };
    
    return (
        <Container sx={{ marginTop: '20px', paddingBottom: '20px' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#4caf50' }}>
                Create New Task
            </Typography>
            {error && <Typography variant="body1" color="error" align="center">{error}</Typography>}

            <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
                <form onSubmit={handleCreateTask}>
                    <FormControl fullWidth variant="outlined" sx={{ marginBottom: '20px' }}>
                        <InputLabel id="jobId-label">Select Job</InputLabel>
                        <Select
                            labelId="jobId-label"
                            id="jobId"
                            value={jobId}
                            onChange={(e) => setJobId(e.target.value)}
                            label="Select Job"
                            required
                        >
                            <MenuItem value="">
                                <em>Select a Job</em>
                            </MenuItem>
                            {jobs.map(job => (
                                <MenuItem key={job.id} value={job.id}>
                                    {job.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Task Description"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        sx={{ marginBottom: '20px' }}
                    />

                    <TextField
                        fullWidth
                        type="datetime-local"
                        variant="outlined"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        required
                        sx={{ marginBottom: '20px' }}
                    />

                    <Button 
                        type="submit" 
                        variant="contained" 
                        sx={{ backgroundColor: '#4caf50', color: 'white', width: '100%' }}
                    >
                        Create Task
                    </Button>
                    <Button 
                      variant="outlined" 
                        onClick={handleBack} 
                         sx={{ marginTop: '20px', color: '#4caf50' }}
                        >
                         Back
                    </Button>
                    
                </form>
            </Paper>
            
        </Container>
    );
}

export default CreateTask;
