import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';

function JobPostingForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [locations, setLocations] = useState([]); // State to hold location options
    const [jobType, setJobType] = useState('');
    const [payRate, setPayRate] = useState('');
    const [proposedTime, setProposedTime] = useState('');

    const jobTypes = [
        'Respite Care',
        'Home Care',
        'Senior Care',
        'Child Care',
        'Disability Care',
        'Palliative Care',
        'Post-Surgical Care',
        'Maternity Care',
        'Dementia Care',
    ];

    // Fetch locations from the backend when the component mounts
    useEffect(() => {
        const fetchLocations = async () => {
            try {
              const token = localStorage.getItem('accessToken'); 
              if (!token) {
                console.error('User is not logged in. Please log in to continue.');
                return;
              }
      
              const response = await axios.get('http://127.0.0.1:8000/api/jobs/locations/', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setLocations(response.data);
            } catch (error) {
              console.error('Error fetching locations', error);
            }
          };
      
          fetchLocations();
    }, []);

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken'); 
            await axios.post('http://127.0.0.1:8000/api/jobs/create/', {
                title,
                description,
                location,
                job_type: jobType,
                pay_rate: payRate,
                proposed_time: proposedTime,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Job posted successfully!');
        } catch (error) {
            console.error('Error posting job', error);
        }
    };

    return (
        <Container sx={{ bgcolor: '#e0f2e9', padding: 3, borderRadius: 2, boxShadow: 2, mt: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32' }}>
                Post a Job
            </Typography>
            <form onSubmit={handlePostJob}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ bgcolor: '#ffffff' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ bgcolor: '#ffffff' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="location-label">Location</InputLabel>
                            <Select
                                labelId="location-label"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                sx={{ bgcolor: '#ffffff' }}
                            >
                                <MenuItem value="" disabled>Select Location</MenuItem>
                                {locations.map((loc) => (
                                    <MenuItem key={loc.id} value={loc.name}>{loc.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="job-type-label">Job Type</InputLabel>
                            <Select
                                labelId="job-type-label"
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                                required
                                sx={{ bgcolor: '#ffffff' }}
                            >
                                <MenuItem value="" disabled>Select Job Type</MenuItem>
                                {jobTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Pay Rate"
                            variant="outlined"
                            value={payRate}
                            onChange={(e) => setPayRate(e.target.value)}
                            sx={{ bgcolor: '#ffffff' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Proposed Time"
                            type="datetime-local"
                            variant="outlined"
                            value={proposedTime}
                            onChange={(e) => setProposedTime(e.target.value)}
                            sx={{ bgcolor: '#ffffff' }}
                            InputLabelProps={{
                                shrink: true, // This will keep the label above the input
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
                        >
                            Post Job
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default JobPostingForm;
