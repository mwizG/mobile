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
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [experienceCategories, setExperienceCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  // Load search results and form values from local storage when component mounts
  useEffect(() => {
    const savedLocation = localStorage.getItem('search_location');
    const savedServiceType = localStorage.getItem('search_service_type');
    const savedAvailability = localStorage.getItem('search_availability');
    const savedCaregivers = localStorage.getItem('search_caregivers');

    if (savedLocation) setLocation(savedLocation);
    if (savedServiceType) setServiceType(savedServiceType);
    if (savedAvailability) setAvailability(savedAvailability);
    if (savedCaregivers) {
      setCaregivers(JSON.parse(savedCaregivers));
    }
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem('accessToken'); 
        if (!token) {
          console.error('User is not logged in. Please log in to continue.');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/accounts/locations/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations', error);
      }
    };

    fetchLocations();
  }, []);

  const startConversation = async (caregiverUsername) => {
    try {
      const token = localStorage.getItem('accessToken'); 

      const conversationsResponse = await axios.get('http://127.0.0.1:8000/api/messaging/conversations/', {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed formatting
        },
      });

      const existingConversation = conversationsResponse.data.find(conversation =>
        conversation.participants.includes(caregiverUsername)
      );

      if (existingConversation) {
        navigate(`/conversations/${existingConversation.id}/messages`);
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/messaging/conversations/', {
          participants: [caregiverUsername],
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        navigate(`/conversations/${response.data.id}/messages`);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  useEffect(() => {
    const fetchExperienceCategories = async () => {
        try {
            const token = localStorage.getItem('accessToken');  // or however you store your token
            if (!token) {
                console.error('User is not logged in. Please log in to continue.');
                return;
            }

            const response = await axios.get('http://127.0.0.1:8000/api/accounts/experience-categories/', {
                headers: {
                    'Authorization': `Token ${token}` // Use the correct token format
                }
            });
            console.log('Fetched experience categories:', response.data);
            setExperienceCategories(response.data); // Ensure this line is executed correctly
        } catch (error) {
            console.error('Error fetching experience categories:', error);
        }
    };

    fetchExperienceCategories();
}, []);


  console.log('the service types: ', experienceCategories);
  // Save search form values to local storage
  useEffect(() => {
    localStorage.setItem('search_location', location);
    localStorage.setItem('search_service_type', serviceType);
    localStorage.setItem('search_availability', availability);
    localStorage.setItem('search_caregivers', JSON.stringify(caregivers));
  }, [location, serviceType, availability, caregivers]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken'); 
      if (!token) {
        console.error('User is not logged in. Please log in to continue.');
        return;
      }
      const response = await axios.get('http://127.0.0.1:8000/api/accounts/caregivers/search/', {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed formatting
        },
        params: {
          location,
          service_type: serviceType,
          availability,
        },
      });
      setCaregivers(response.data);
    } catch (error) {
      console.error('Error searching for caregivers', error);
    } finally {
      setLoading(false);
    }
  };

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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
                <Card elevation={2} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
                  <CardContent>
                    <Avatar
                      src={caregiver.profile_image}  // Use the correct property
                      alt={`${caregiver.first_name || ''} ${caregiver.last_name || ''}`.trim() || 'Caregiver'}
                      sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                    />
                    <Typography variant="h6">
                      {`${caregiver.first_name || 'N/A'} ${caregiver.last_name || 'N/A'}`.trim()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      username: {caregiver.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {caregiver.experience_cat1?.name || 'No Experience Listed'} - {caregiver.location}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center' }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => goToCaregiverProfile(caregiver.id)}
                    >
                      View Profile
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => startConversation(caregiver.username)}
                    >
                      Message
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
