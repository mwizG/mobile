import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

// Experience category options
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

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '', // New field for first name
    last_name: '',  // New field for last name
    is_care_seeker: false,
    is_caregiver: false,
    location: '',
    bio: '',
    experience_cat1: '', // New field for experience category 1
    experience_cat2: '', // New field for experience category 2
    experience_cat3: '', // New field for experience category 3
    certifications: '',
    health_status: '',
    contact_info: '',
    profile_image: null,
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

  const handleExperienceChange = (field, event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      [field]: value,
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
      if (error.response) {
        console.error('Registration failed', error.response.data);
        alert(`Registration failed: ${error.response.data.detail || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received', error.request);
        alert('No response from the server, please try again later.');
      } else {
        console.error('Error', error.message);
        alert(`Error: ${error.message}`);
      }
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
        {/* First Name and Last Name */}
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="first_name"
          onChange={handleChange}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="last_name"
          onChange={handleChange}
        />

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

            {/* Experience Categories Dropdowns */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="experience-cat1-label">Experience Category 1</InputLabel>
              <Select
                labelId="experience-cat1-label"
                value={formData.experience_cat1}
                onChange={(e) => handleExperienceChange('experience_cat1', e)}
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
                value={formData.experience_cat2}
                onChange={(e) => handleExperienceChange('experience_cat2', e)}
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
                value={formData.experience_cat3}
                onChange={(e) => handleExperienceChange('experience_cat3', e)}
              >
                {experienceOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
        <Box sx={{ mt: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-image"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="profile-image">
            <Button variant="contained" component="span" sx={{ backgroundColor: '#388e3c' }}>
              Upload Profile Image
            </Button>
          </label>
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4, backgroundColor: '#388e3c' }}
        >
          Register
        </Button>
      </form>
    </Container>
  );
}

export default Register;
