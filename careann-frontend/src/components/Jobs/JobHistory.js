import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Grid, Card, CardContent, Paper, Container, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)({
  backgroundColor: '#f0f4f1', // Pale green background
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const StyledCard = styled(Card)({
  border: '1px solid #c8e6c9', // Light green border
  borderRadius: '10px',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Slight shadow on hover
  },
});

function JobHistory() {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Retrieve the access token
        const response = await axios.get('http://192.168.251.86:8000/api/jobs/completed/', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        setCompletedJobs(response.data); // Set completed jobs data
      } catch (error) {
        setError('Error fetching completed jobs.');
        console.error('Error fetching completed jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
  }, []);

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom align="center" sx={{ marginTop: '20px', color: '#388e3c' }}>
        Completed Job History
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="body2" align="center" color="error">{error}</Typography>
      ) : completedJobs.length > 0 ? (
        <Grid container spacing={2}>
          {completedJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#388e3c' }}>{job.title}</Typography>
                  <Typography variant="body2">
                    <strong>Care Seeker:</strong> {job.care_seeker.username}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Description:</strong> {job.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong> {job.location}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Pay Rate:</strong> ${job.pay_rate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {job.status}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Scheduled Time:</strong> {new Date(job.scheduled_time).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Created At:</strong> {new Date(job.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" align="center">No completed jobs found.</Typography>
      )}
    </StyledContainer>
  );
}

export default JobHistory;
