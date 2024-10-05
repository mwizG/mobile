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
  Avatar,
  Stack,
  Divider,
} from '@mui/material';

function CareSeekerDetail() {
  const { careSeekerId } = useParams(); // Get care seeker ID from URL params
  const [careSeeker, setCareSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCareSeeker = async () => {
      try {
        const token = localStorage.getItem('accessToken'); 
        const response = await axios.get(`http://127.0.0.1:8000/api/accounts/careseekers/${careSeekerId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCareSeeker(response.data);
      } catch (error) {
        setError('Error fetching care seeker details. Please try again later.');
        console.error('Error fetching care seeker details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareSeeker();
  }, [careSeekerId]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading care seeker details...</Typography>
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
        {/* Header Section */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            src={careSeeker.profile_image}
            alt={`${careSeeker.username}'s profile image`}
            sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40 }}
          >
            {careSeeker.username.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {careSeeker.username}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {careSeeker.email}
            </Typography>
            <Typography variant="body1">
              <strong>Location:</strong> {careSeeker.location || 'Not provided'}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Care Seeker Details Section */}
        <Typography variant="h6" gutterBottom>
          About {careSeeker.username}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Health Status:</strong> {careSeeker.health_status || 'No health status provided'}
        </Typography>
        <Typography variant="body1">
          <strong>Contact Info:</strong> {careSeeker.contact_info || 'No contact info provided'}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Care Seeker Preferences Section */}
        <Typography variant="h6" gutterBottom>
          Care Preferences
        </Typography>
        <Typography variant="body1">
          <strong>Preferred Type of Care:</strong> {careSeeker.preferred_care_type || 'Not specified'}
        </Typography>
        <Typography variant="body1">
          <strong>Budget:</strong> {careSeeker.budget || 'Not specified'}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Care Seeker Social Links Section */}
        <Typography variant="h6" gutterBottom>
          Social Links
        </Typography>
        <Box>
          {careSeeker.social_links && careSeeker.social_links.length > 0 ? (
            careSeeker.social_links.map((link, index) => (
              <Typography
                key={index}
                sx={{ display: 'block', mb: 1, textDecoration: 'none', color: 'primary.main' }}
              >
                {link.platform}: <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
              </Typography>
            ))
          ) : (
            <Typography variant="body1">No social links provided.</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default CareSeekerDetail;
