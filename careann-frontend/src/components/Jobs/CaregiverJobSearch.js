import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';

function CaregiverJobSearch() {
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [payRate, setPayRate] = useState('');
  const [status, setStatus] = useState('Open');
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User is not logged in. Please log in to continue.');
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/jobs/job-types/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setJobTypes(response.data);
    } catch (error) {
      console.error('Error fetching job types', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User is not logged in. Please log in to continue.');
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/jobs/locations/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations', error);
    }
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true); // Set loading state
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/jobs/search', {
        headers: {
          Authorization: `Token ${token}`,
        },
        params: {
          location,
          job_type: jobType,
          pay_rate: payRate,
          status,
        },
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [location, jobType, payRate, status]);

  useEffect(() => {
    fetchJobTypes();
    fetchLocations();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Search for Jobs
      </Typography>
      <Box component="form" noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <Grid container spacing={2}>
          {/* Location Dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={location}
                label="Location"
                onChange={(e) => setLocation(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select Location</em>
                </MenuItem>
                {locations.map((loc, index) => (
                  <MenuItem key={index} value={loc.name}>
                    {loc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Job Type Dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Job Type</InputLabel>
              <Select
                value={jobType}
                label="Job Type"
                onChange={(e) => setJobType(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select Job Type</em>
                </MenuItem>
                {jobTypes.map((type, index) => (
                  <MenuItem key={index} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Pay Rate Input */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Pay Rate"
              type="number"
              value={payRate}
              onChange={(e) => setPayRate(e.target.value)}
              placeholder="Enter Pay Rate"
            />
          </Grid>

          {/* Status Dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Declined">Declined</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Search Button */}
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={fetchJobs}
              sx={{ marginTop: 2 }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Display Loading Indicator */}
      {loading && <Typography variant="h6">Loading...</Typography>}

      {/* Display Available Jobs */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Results
        </Typography>
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid item key={job.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    <Link to={`/caregiver/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {job.title}
                    </Link>
                  </Typography>
                  <Typography color="textSecondary">
                    {job.location} - K{job.pay_rate}/hr
                  </Typography>
                  <Typography variant="body2">{job.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to={`/caregiver/jobs/${job.id}`}
                    variant="outlined"
                    color="primary"
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default CaregiverJobSearch;
