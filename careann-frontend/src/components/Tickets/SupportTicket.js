
import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Grid } from '@mui/material';

function SupportTicket() {
  const [issue, setIssue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (!token) {
        setError('User is not authenticated. Please log in.');
        return;
      }

      // Post request to create a support ticket
      const response = await axios.post(
        'http://127.0.0.1:8000/api/admin_panel/ticket/create/',
        { issue }, // Send the issue field as the request body
        {
          headers: {
            Authorization: `Token ${token}`, // Pass the token in the request header
          },
        }
      );

      if (response.status === 201) {
        setSuccess(true); // Set success state to true
        setError(''); // Clear error state if any
        setIssue(''); // Reset the issue input field
        alert('Support ticket created successfully!');
      }
    } catch (error) {
      setError('Error creating support ticket. Please try again.');
    }
  };

  return (
    <Container sx={{ bgcolor: '#e0f2e9', padding: 3, borderRadius: 2, marginTop: '20px', maxWidth: '600px' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32' }}>
        Create a Support Ticket
      </Typography>

      {/* Display success message */}
      {success && (
        <Typography variant="body1" color="success" sx={{ marginBottom: '15px' }}>
          Ticket submitted successfully!
        </Typography>
      )}

      {/* Display error message */}
      {error && (
        <Typography variant="body1" color="error" sx={{ marginBottom: '15px' }}>
          {error}
        </Typography>
      )}

      {/* Support ticket creation form */}
      <form onSubmit={handleCreateTicket}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Describe your issue"
              variant="outlined"
              multiline
              rows={4}
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
              sx={{ bgcolor: '#ffffff' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}>
              Submit Ticket
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default SupportTicket;
