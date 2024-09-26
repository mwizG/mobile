import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../services/api'; // Import the API service
import { TextField, Button, Typography, Container, CircularProgress } from '@mui/material';

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
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
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
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </form>
    </Container>
  );
}

export default Login;
