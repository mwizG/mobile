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
  Link,
} from '@mui/material';

function CaregiverDetail() {
  const { caregiverId } = useParams(); // Get caregiver ID from URL params
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState([]); // State to hold credentials
  const [credentialError, setCredentialError] = useState(null); // State to hold credential errors
  const [credentialLoading, setCredentialLoading] = useState(true); // State for loading credentials

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

  // Fetch credentials for the caregiver
  useEffect(() => {
    
    const fetchCredentials = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/accounts/caregivers/${caregiverId}/credentials/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setCredentials(response.data);
      } catch (error) {
        setCredentialError('Error fetching caregiver credentials. Please try again later.');
        console.error('Error fetching caregiver credentials:', error);
      } finally {
        setCredentialLoading(false);
      }
    };
    
      fetchCredentials();
    }, [caregiverId]); // Add caregiverId as a dependency
    

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
        {/* Header Section */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            src={caregiver.profile_image}
            alt={`${caregiver.username}'s profile image`}
            sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40 }}
          >
            {caregiver.username.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {caregiver.username}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {caregiver.email}
            </Typography>
            <Typography variant="body1">
              <strong>Location:</strong> {caregiver.location || 'Not provided'}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Caregiver Details Section */}
        <Typography variant="h6" gutterBottom>
          About {caregiver.username}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {caregiver.bio || 'No bio provided.'}
        </Typography>

        {/* Experience Categories */}
        <Typography variant="body1">
          <strong>Experience Categories:</strong>{' '}
          {[
            caregiver.experience_cat1,
            caregiver.experience_cat2,
            caregiver.experience_cat3,
          ]
            .map(cat => (cat && cat.name) || null) // Adjust 'name' to the actual property you want to display
            .filter(Boolean)
            .join(', ') || 'No experience categories provided'}
        </Typography>
        <Typography variant="body1">
          <strong>Availability:</strong> {caregiver.availability || 'Not available'}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Ratings Section */}
        <Typography variant="h6" gutterBottom>
          Ratings
        </Typography>
        <Typography variant="body1">
          <strong>Average Rating:</strong>{' '}
          {caregiver.average_rating ? caregiver.average_rating.toFixed(2) : 'No rating yet'}
        </Typography>
        <Typography variant="body1">
          <strong>Number of Ratings:</strong> {caregiver.rating_count || 0}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Social Links Section */}
        <Typography variant="h6" gutterBottom>
          Social Links
        </Typography>
        <Box>
          {caregiver.social_links && caregiver.social_links.length > 0 ? (
            caregiver.social_links.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'block', mb: 1, textDecoration: 'none', color: 'primary.main' }}
              >
                {link.platform}: {link.url}
              </Link>
            ))
          ) : (
            <Typography variant="body1">No social links provided.</Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Credentials Section */}
        <Typography variant="h6" gutterBottom>
          Credentials
        </Typography>
        {credentialLoading ? (
          <CircularProgress />
        ) : credentialError ? (
          <Alert severity="error">{credentialError}</Alert>
        ) : (
          <Box sx={{ mt: 3 }}>
          {credentials.length > 0 ? (
            credentials.map((credential, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body1">{credential.name} (Uploaded at: {new Date(credential.uploaded_at).toLocaleDateString()})</Typography>
                <a href={credential.file} target="_blank" rel="noopener noreferrer">View Document</a>
              </Box>
              ))
            ) : (
              <Typography variant="body1">No credentials available.</Typography>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default CaregiverDetail;
