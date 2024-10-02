import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Box,
  Paper,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Divider,
} from '@mui/material';

function SearchCaregiversForm() {
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [availability, setAvailability] = useState('');
  const [experience, setExperience] = useState('');
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [experienceCategories, setExperienceCategories] = useState([]);
  const [locations, setLocations] = useState([]); // Moved location state here
  const navigate = useNavigate();

  // Fetch locations for the dropdown with Authorization header
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('User is not logged in. Please log in to continue.');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/accounts/locations/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations', error);
      }
    };

    fetchLocations(); // Fetch locations on component mount
  }, []);

  // Fetch experience categories for the dropdown with Authorization header
  useEffect(() => {
    const fetchExperienceCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('User is not logged in. Please log in to continue.');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/accounts/experience-categories/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setExperienceCategories(response.data);
      } catch (error) {
        console.error('Error fetching experience categories', error);
      }
    };

    fetchExperienceCategories(); // Fetch experience categories on component mount
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User is not logged in. Please log in to continue.');
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/accounts/caregivers/search/', {
        headers: {
          Authorization: `Token ${token}`,
        },
        params: {
          location,
          service_type: serviceType,
          availability,
          experience,
        },
      });
      setCaregivers(response.data);
    } catch (error) {
      console.error('Error searching for caregivers', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to the caregiver's detail page
  const goToCaregiverProfile = (caregiverId) => {
    navigate(`/caregiver/${caregiverId}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: '#f9f9f9' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'primary.main' }}>
          Search for Caregivers
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                value={location} // Use location as the value
                onChange={(e) => setLocation(e.target.value)} // Update the location on change
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="">
                  <em>Select Location</em>
                </MenuItem>
                {locations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.name}>
                    {loc.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="">
                  <em>Select Service Type</em>
                </MenuItem>
                {experienceCategories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Experience (Years)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: 'primary.main', color: 'white', px: 4, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
          Search Results
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading caregivers...
            </Typography>
          </Box>
        ) : caregivers.length === 0 ? (
          <Typography variant="body1" align="center">
            No caregivers found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {caregivers.map((caregiver) => (
              <Grid item xs={12} sm={6} md={4} key={caregiver.id}>
                <Card
                  elevation={2}
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {caregiver.username.charAt(0)}
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{ cursor: 'pointer', color: 'primary.main' }}
                        onClick={() => goToCaregiverProfile(caregiver.id)}
                      >
                        {caregiver.username}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Experience Category: {caregiver.experience_cat1 ? caregiver.experience_cat1.name : 'No Category'}
                    </Typography>
                    <Typography variant="body2">
                      Years of Experience: {caregiver.experience || 'Not provided'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ color: 'primary.main' }}
                      onClick={() => goToCaregiverProfile(caregiver.id)}
                    >
                      View Profile
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
}

export default SearchCaregiversForm;
