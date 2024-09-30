import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchTickets = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/admin_panel/tickets/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <Container sx={{ bgcolor: '#e0f2e9', padding: 3, borderRadius: 2, marginTop: '20px', maxWidth: '800px' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32' }}>
        Your Support Tickets
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/support')}  // Use navigate instead of history.push
        sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' }, marginBottom: '20px' }}
      >
        Create New Ticket
      </Button>

      <Grid container spacing={2}>
        {tickets.map(ticket => (
          <Grid item xs={12} key={ticket.id}>
            <Typography variant="h6">{ticket.issue}</Typography>
            <Typography>Status: {ticket.status}</Typography>
            <Button variant="outlined" onClick={() => navigate(`/ticket-update/${ticket.id}`)}> {/* Use navigate */}
              View Details
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default TicketsPage;
