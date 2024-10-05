import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button } from '@mui/material';
import { useParams } from 'react-router-dom';

function TicketUpdate() {
  const { ticketId } = useParams(); // Use 'ticketId' to match the route parameter name
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');

  const fetchTicket = async () => {
    try {
      const token = localStorage.getItem('accessToken'); 
      const response = await axios.get(`http://127.0.0.1:8000/api/admin_panel/tickets/${ticketId}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed formatting
        },
      });
      setTicket(response.data); // Set the ticket details in state
    } catch (err) {
      console.error('Error fetching ticket details:', err); // Log the error for debugging
      setError('Error fetching ticket details. Please try again.');
    }
  };

  useEffect(() => {
    console.log('Ticket ID:', ticketId); // Log the ID to see its value
    if (ticketId) {
      fetchTicket();
    } else {
      setError('Invalid ticket ID'); // Handle case where id is undefined
    }
  }, [ticketId]);

  // Display loading or error messages
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!ticket) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container sx={{ bgcolor: '#e0f2e9', padding: 3, borderRadius: 2, marginTop: '20px', maxWidth: '600px' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32' }}>
        Ticket Details
      </Typography>
      <Typography variant="h6">Issue: {ticket.issue}</Typography>
      <Typography>Status: {ticket.status}</Typography>
      <Typography>Created At: {new Date(ticket.created_at).toLocaleString()}</Typography>
      <Typography>Resolved By: {ticket.resolved_by || 'Not yet resolved'}</Typography>
      <Typography>Resolution Notes: {ticket.resolution_notes || 'N/A'}</Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => window.history.back()}
        sx={{ marginTop: '20px' }}
      >
        Back to Tickets
      </Button>
    </Container>
  );
}

export default TicketUpdate;
