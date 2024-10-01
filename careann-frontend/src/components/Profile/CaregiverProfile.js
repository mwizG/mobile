import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

// Updated experience options with IDs
const experienceOptions = [
    { id: 1, name: 'Respite Care' },
    { id: 2, name: 'Home Care' },
    { id: 3, name: 'Senior Care' },
    { id: 4, name: 'Child Care' },
    { id: 5, name: 'Disability Care' },
    { id: 6, name: 'Palliative Care' },
    { id: 7, name: 'Post-Surgical Care' },
    { id: 8, name: 'Maternity Care' },
    { id: 9, name: 'Dementia Care' },
];

function CaregiverProfile() {
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    email: '',
    username: '',
    location: '',
    bio: '',
    certifications: '',
    experience_cat1: '',
    experience_cat2: '',
    experience_cat3: '',
    profile_image: null,
  });

  useEffect(() => {
    const fetchCaregiver = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/accounts/profile/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setCaregiver(response.data);
        setProfile({
          email: response.data.email || '',
          username: response.data.username || '',
          location: response.data.location || '',
          bio: response.data.bio || '',
          certifications: response.data.certifications || '',
          experience_cat1: response.data.experience_cat1?.id || '',
          experience_cat2: response.data.experience_cat2?.id || '',
          experience_cat3: response.data.experience_cat3?.id || '',
          profile_image: response.data.profile_image || null,
        });
      } catch (error) {
        setError('Error fetching caregiver details. Please try again later.');
        console.error('Error fetching caregiver details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiver();
  }, []);

  // Handle profile input change
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image input change
  const handleImageChange = (e) => {
    setProfile({
      ...profile,
      profile_image: e.target.files[0],
    });
  };

  // Handle form submission for profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Append each profile field to the FormData
      for (let key in profile) {
        if (profile[key] !== null && profile[key] !== '') {
          formData.append(key, profile[key]);
        }
      }

      const response = await axios.put(`http://127.0.0.1:8000/api/accounts/profile/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          // Remove 'Content-Type' header, let browser set it
        },
      });

      alert('Profile updated successfully');
      setEditMode(false);

      // Optionally re-fetch updated data
      const updatedProfile = await axios.get(`http://127.0.0.1:8000/api/accounts/profile/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setCaregiver(updatedProfile.data);
    } catch (error) {
      // Log the error response from the server
      if (error.response) {
        console.error('Error updating profile:', error.response.data);
        setError('Error updating profile: ' + error.response.data.detail || 'Please try again.');
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

        {editMode ? (
          <form onSubmit={handleSubmit}>
            {/* Form fields to update caregiver profile */}
            <TextField
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Username"
              name="username"
              value={profile.username}
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
              placeholder="Optional"
            />
            <TextField
              label="Bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              placeholder="Optional"
            />
            <TextField
              label="Certifications"
              name="certifications"
              value={profile.certifications}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="Optional"
            />

            {/* Experience Categories Dropdowns */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="experience-cat1-label">Experience Category 1</InputLabel>
              <Select
                labelId="experience-cat1-label"
                name="experience_cat1"
                value={profile.experience_cat1}
                onChange={handleChange}
              >
                {experienceOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="experience-cat2-label">Experience Category 2</InputLabel>
              <Select
                labelId="experience-cat2-label"
                name="experience_cat2"
                value={profile.experience_cat2}
                onChange={handleChange}
              >
                {experienceOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="experience-cat3-label">Experience Category 3</InputLabel>
              <Select
                labelId="experience-cat3-label"
                name="experience_cat3"
                value={profile.experience_cat3}
                onChange={handleChange}
              >
                {experienceOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Profile Image Upload */}
            <Box sx={{ mt: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-image"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="profile-image">
                <Button variant="contained" component="span">
                  Upload Profile Image
                </Button>
              </label>
            </Box>

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setEditMode(false)}
              sx={{ mt: 2, ml: 2 }}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Bio:</strong> {caregiver.bio || 'Not provided'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Certifications:</strong> {caregiver.certifications || 'Not provided'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Experience Categories:</strong> {caregiver.experience_cat1?.name || 'N/A'}, {caregiver.experience_cat2?.name || 'N/A'}, {caregiver.experience_cat3?.name || 'N/A'}
            </Typography>

            {/* Button to edit profile */}
            <Button variant="outlined" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default CaregiverProfile;
