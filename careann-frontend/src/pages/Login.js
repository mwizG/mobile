import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../services/api'; // Import the API service
import { TextField, Button, Typography, Container, CircularProgress, Box } from '@mui/material';
import '@fontsource/poppins';  // Creative typography import

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = { username, password };
      const response = await apiPost('/accounts/login/', data); // Use the API service

      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);

      if (response.role === 'care_seeker') {
        navigate('/care-seeker/dashboard');
      } else if (response.role === 'caregiver') {
        navigate('/caregiver/dashboard');
      } else if (response.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/'); // Fallback to home if role is not recognized
      }
    } catch (error) {
      console.error('Login failed', error);
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: '#388e3c' }}
          gutterBottom
        >
          Login
        </Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      </Box>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          sx={{ fontFamily: 'Poppins, sans-serif' }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          sx={{ fontFamily: 'Poppins, sans-serif' }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ 
            mt: 2, 
            fontFamily: 'Poppins, sans-serif', 
            fontWeight: '600', 
            backgroundColor: '#81c784',
            '&:hover': { backgroundColor: '#66bb6a' }
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </form>
    </Container>
  );
}

export default Login;
