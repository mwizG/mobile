import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Radio, RadioGroup, FormControlLabel, Grid } from '@mui/material';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    is_care_seeker: false,
    is_caregiver: false,
    location: '',
    bio: '',
    experience: '',
    certifications: '',
    availability: '',
    profile_image: null,
    payment_preference: '',
    experience_categories: '',
    health_status: '',
    contact_info: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      is_care_seeker: role === 'care_seeker',
      is_caregiver: role === 'caregiver',
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    try {
      await axios.post('http://127.0.0.1:8000/api/accounts/register/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography 
        variant="h4" 
        sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: '#388e3c', textAlign: 'center', mb: 4 }}
      >
        Register
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Username, Email, Password */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          name="username"
          onChange={handleChange}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          name="email"
          onChange={handleChange}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          onChange={handleChange}
        />

        {/* Role Selection */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Select Role</Typography>
          <RadioGroup row>
            <FormControlLabel 
              value="care_seeker" 
              control={<Radio />} 
              label="Care Seeker"
              checked={formData.is_care_seeker}
              onChange={() => handleRoleChange('care_seeker')}
            />
            <FormControlLabel 
              value="caregiver" 
              control={<Radio />} 
              label="Caregiver"
              checked={formData.is_caregiver}
              onChange={() => handleRoleChange('caregiver')}
            />
          </RadioGroup>
        </Box>

        {/* Conditional Fields for Care Seekers */}
        {formData.is_care_seeker && (
          <>
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              margin="normal"
              name="location"
              onChange={handleChange}
            />
            <TextField
              label="Health Status"
              variant="outlined"
              fullWidth
              margin="normal"
              name="health_status"
              onChange={handleChange}
            />
            <TextField
              label="Contact Info"
              variant="outlined"
              fullWidth
              margin="normal"
              name="contact_info"
              onChange={handleChange}
            />
            <TextField
              label="Bio"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              name="bio"
              onChange={handleChange}
            />
          </>
        )}

        {/* Conditional Fields for Caregivers */}
        {formData.is_caregiver && (
          <>
            <TextField
              label="Experience"
              variant="outlined"
              fullWidth
              margin="normal"
              name="experience"
              onChange={handleChange}
            />
            <TextField
              label="Certifications"
              variant="outlined"
              fullWidth
              margin="normal"
              name="certifications"
              onChange={handleChange}
            />
            <TextField
              label="Availability"
              variant="outlined"
              fullWidth
              margin="normal"
              name="availability"
              onChange={handleChange}
            />
            <TextField
              label="Payment Preference"
              variant="outlined"
              fullWidth
              margin="normal"
              name="payment_preference"
              onChange={handleChange}
            />
            <TextField
              label="Experience Categories"
              variant="outlined"
              fullWidth
              margin="normal"
              name="experience_categories"
              onChange={handleChange}
            />
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              margin="normal"
              name="location"
              onChange={handleChange}
            />
            <TextField
              label="Contact Info"
              variant="outlined"
              fullWidth
              margin="normal"
              name="contact_info"
              onChange={handleChange}
            />
            <TextField
              label="Bio"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              name="bio"
              onChange={handleChange}
            />
          </>
        )}

        {/* Profile Image Upload */}
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mt: 2, mb: 3, backgroundColor: '#81c784', '&:hover': { backgroundColor: '#66bb6a' } }}
        >
          Upload Profile Image
          <input
            type="file"
            hidden
            name="profile_image"
            onChange={handleFileChange}
          />
        </Button>

        {/* Register Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, fontFamily: 'Poppins, sans-serif', fontWeight: '600', backgroundColor: '#388e3c', '&:hover': { backgroundColor: '#2e7d32' } }}
        >
          Register
        </Button>
      </form>
    </Container>
  );
}

export default Register;
