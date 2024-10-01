import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Button,
  TextField,
} from '@mui/material';

function CareSeekerDetail() {
  const [careSeeker, setCareSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    username: '', // Include username in the profile state
    email: '',
    location: '',
    health_status: '',
    contact_info: '',
  });

  useEffect(() => {
    const fetchCareSeeker = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/accounts/profile/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setCareSeeker(response.data);
        setProfile(response.data); // Set profile state with fetched care seeker data
      } catch (error) {
        setError('Error fetching care seeker details. Please try again later.');
        console.error('Error fetching care seeker details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareSeeker();
  }, []);

  // Handle profile input change
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Include the username in the update data
      const updatedProfileData = {
        username: profile.username, // Include username
        email: profile.email,
        location: profile.location,
        health_status: profile.health_status,
        contact_info: profile.contact_info,
      };

      const response = await axios.put('http://127.0.0.1:8000/api/accounts/profile/', updatedProfileData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      // Log the response for debugging
      console.log('Profile updated response:', response.data);

      alert('Profile updated successfully');
      setEditMode(false); // Switch back to view mode

      // Optionally re-fetch updated data to reflect changes immediately
      const updatedProfile = await axios.get('http://127.0.0.1:8000/api/accounts/profile/', {
        headers: { Authorization: `Token ${token}` },
      });
      setCareSeeker(updatedProfile.data);
    } catch (error) {
      // Log the error response from the server
      if (error.response) {
        console.error('Error updating profile:', error.response.data);
        setError('Error updating profile: ' + (error.response.data.detail || 'Please try again.'));
      } else {
        console.error('Error updating profile', error);
        setError('Error updating profile. Please try again.');
      }
    }
  };

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

        {editMode ? (
          <form onSubmit={handleSubmit}>
            {/* Form fields to update care seeker profile */}
            <TextField
              label="Username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Location"
              name="location"
              value={profile.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Health Status"
              name="health_status"
              value={profile.health_status}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact Info"
              name="contact_info"
              value={profile.contact_info}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Save Changes
            </Button>
            <Button
              variant="text"
              color="secondary"
              onClick={() => setEditMode(false)} // Cancel edit mode
              sx={{ mt: 2 }}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <>
            {/* View mode */}
            <Typography variant="h6" gutterBottom>
              About {careSeeker.username}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Email:</strong> {careSeeker.email}
            </Typography>
            <Typography variant="body1">
              <strong>Location:</strong> {careSeeker.location || 'Not provided'}
            </Typography>
            <Typography variant="body1">
              <strong>Health Status:</strong> {careSeeker.health_status || 'No health status provided'}
            </Typography>
            <Typography variant="body1">
              <strong>Contact Info:</strong> {careSeeker.contact_info || 'No contact info provided'}
            </Typography>

            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default CareSeekerDetail;
