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
  { id: 3, name: 'Child Care' },
  { id: 4, name: 'Disability Care' },
  { id: 5, name: 'Palliative Care' },
  { id: 6, name: 'Post-Surgical Care' },
  { id: 7, name: 'Maternity Care' },
  { id: 8, name: 'Dementia Care' },
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
    availability: '',
    payment_preference: '',
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
          availability: response.data.availability || '',
          payment_preference: response.data.payment_preference || '',
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
      for (let key in profile) {
        formData.append(key, profile[key]);
      }

      // Perform the PUT request to update the profile
      await axios.put(`http://127.0.0.1:8000/api/accounts/profile/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Updated caregiver data fetched:", updatedProfile.data);
      alert('Profile updated successfully');
      setEditMode(false); // Switch back to view mode

      // Optionally re-fetch updated data to reflect changes immediately
      const updatedProfile = await axios.get(`http://127.0.0.1:8000/api/accounts/profile/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setCaregiver(updatedProfile.data);
    } catch (error) {
      console.error('Error updating profile', error);
      setError('Error updating profile. Please try again.');
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
            />
            <TextField
              label="Bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <TextField
              label="Certifications"
              name="certifications"
              value={profile.certifications}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Availability"
              name="availability"
              value={profile.availability}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Payment Preference"
              name="payment_preference"
              value={profile.payment_preference}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            {/* Experience Category 1 Dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }} margin="normal">
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

            {/* Experience Category 2 Dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }}>
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

            <FormControl fullWidth sx={{ mb: 2 }}>
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

            <div>
              <label>Profile Image:</label>
              <input type="file" name="profile_image" onChange={handleImageChange} />
            </div>

            {/* Save and Cancel Buttons */}
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </Box>
          </form>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Bio: {caregiver.bio || 'Not provided'}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Certifications: {caregiver.certifications || 'Not provided'}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Availability: {caregiver.availability || 'Not provided'}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Payment Preference: {caregiver.payment_preference || 'Not provided'}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Experience Categories:
            </Typography>
            <ul>
              <li>Category 1: {caregiver.experience_cat1?.name || 'Not provided'}</li>
              <li>Category 2: {caregiver.experience_cat2?.name || 'Not provided'}</li>
              <li>Category 3: {caregiver.experience_cat3?.name || 'Not provided'}</li>
            </ul>

            {/* Edit Button */}
            <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default CaregiverProfile;
