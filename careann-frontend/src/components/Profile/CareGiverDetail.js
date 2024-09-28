import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';

function CaregiverDetail() {
  const { caregiverId } = useParams(); // Get caregiver ID from URL params
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaregiver = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/accounts/caregivers/${caregiverId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setCaregiver(response.data);
      } catch (error) {
        setError('Error fetching caregiver details. Please try again later.');
        console.error('Error fetching caregiver details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiver();
  }, [caregiverId]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading caregiver details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          {caregiver.username}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {caregiver.email}
        </Typography>
        <Typography variant="body1">
          <strong>Location:</strong> {caregiver.location || 'Not provided'}
        </Typography>
        <Typography variant="body1">
          <strong>Experience Categories:</strong> {caregiver.experience_categories?.map(category => category.name).join(', ') || 'No experience categories provided'}
        </Typography>
        <Typography variant="body1">
          <strong>Certifications:</strong> {caregiver.certifications || 'No certifications'}
        </Typography>
        <Typography variant="body1">
          <strong>Availability:</strong> {caregiver.availability || 'Not available'}
        </Typography>
        <Typography variant="body1">
          <strong>Average Rating:</strong> {caregiver.average_rating ? caregiver.average_rating.toFixed(2) : 'No rating yet'}
        </Typography>
        <Typography variant="body1">
          <strong>Number of Ratings:</strong> {caregiver.rating_count || 0}
        </Typography>
      </Paper>
    </Container>
  );
}

export default CaregiverDetail;
