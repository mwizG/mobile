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
    experience_cat1: '',
    experience_cat2: '',
    experience_cat3: '',
    profile_image: null,
  });
  const [role, setRole] = useState(''); // State for role
  const [credentials, setCredentials] = useState([]); // State for credentials
  const [file, setFile] = useState(null); // State for file upload

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
          experience_cat1: response.data.experience_cat1?.id || '',
          experience_cat2: response.data.experience_cat2?.id || '',
          experience_cat3: response.data.experience_cat3?.id || '',
          profile_image: response.data.profile_image || null,
        });

        const userRole = response.data.is_caregiver ? 'caregiver' : response.data.is_care_seeker ? 'care_seeker' : '';
        setRole(userRole);
      } catch (error) {
        setError('Error fetching caregiver details. Please try again later.');
        console.error('Error fetching caregiver details:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCredentials = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/accounts/credentials/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setCredentials(response.data);
      } catch (error) {
        console.error('Error fetching credentials:', error);
      }
    };

    fetchCaregiver();
    fetchCredentials();
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

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission for profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      const existingProfileImage = caregiver ? caregiver.profile_image : null;

      for (let key in profile) {
        if (profile[key] !== null && profile[key] !== '') {
          if (key === 'profile_image' && profile[key] === existingProfileImage) {
            continue;
          }
          formData.append(key, profile[key]);
        }
      }

      await axios.put(`http://127.0.0.1:8000/api/accounts/profile/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      alert('Profile updated successfully');
      setEditMode(false);
      const updatedProfile = await axios.get(`http://127.0.0.1:8000/api/accounts/profile/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setCaregiver(updatedProfile.data);
      const userRole = updatedProfile.data.is_caregiver ? 'caregiver' : updatedProfile.data.is_care_seeker ? 'care_seeker' : '';
      setRole(userRole);
    } catch (error) {
      if (error.response) {
        console.error('Error updating profile:', error.response.data);
        setError('Error updating profile: ' + error.response.data.detail || 'Please try again.');
      } else {
        console.error('Error updating profile', error);
        setError('Error updating profile. Please try again.');
      }
    }
  };

  const handleUploadCertificate = async (fileName, file) => {
    const formData = new FormData();
    formData.append('name', fileName);
    formData.append('file', file);

    try {
        const token = localStorage.getItem('token'); // Retrieve token here
        const response = await axios.post('http://127.0.0.1:8000/api/accounts/upload_credentials/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${token}`, // Use the token here
            }
        });
        console.log('File uploaded successfully:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error uploading file:', error.response.data);
        } else {
            console.error('Error uploading file:', error);
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
            <Typography variant="body1">
              <strong>Role:</strong> {role || 'Not assigned'}
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
              placeholder="Tell us about yourself"
            />
            {/* Experience Categories Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Experience Category 1</InputLabel>
              <Select
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
              <InputLabel>Experience Category 2</InputLabel>
              <Select
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
              <InputLabel>Experience Category 3</InputLabel>
              <Select
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
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: 16 }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Save Changes
            </Button>
            <Button variant="outlined" onClick={() => setEditMode(false)} sx={{ mt: 2, ml: 1 }}>
              Cancel
            </Button>
          </form>
        ) : (
          <Box>
            <Typography variant="h6">Bio:</Typography>
            <Typography variant="body1">{caregiver.bio || 'No bio provided.'}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Experience:</Typography>
            <Typography variant="body1">
              {caregiver.experience_cat1?.name || 'N/A'}, {caregiver.experience_cat2?.name || 'N/A'}, {caregiver.experience_cat3?.name || 'N/A'}
            </Typography>
            <Button variant="outlined" onClick={() => setEditMode(true)} sx={{ mt: 2 }}>
              Edit Profile
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5">Credentials</Typography>
        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Upload Certificate/CV/ID
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleFileChange}
          />
        </Button>
          <Button
            variant="contained"
            onClick={() => handleUploadCertificate(file ? file.name : '', file)}
            sx={{ mt: 2, ml: 1 }}
            disabled={!file}
          >
            Submit
      </Button>

        
        <Box sx={{ mt: 3 }}>
          {credentials.length > 0 ? (
            credentials.map((credential, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body1">{credential.name} (Uploaded at: {new Date(credential.uploaded_at).toLocaleDateString()})</Typography>
                <a href={credential.file} target="_blank" rel="noopener noreferrer">View Document</a>
              </Box>
            ))
          ) : (
            <Typography variant="body1">No credentials uploaded yet.</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default CaregiverProfile;
