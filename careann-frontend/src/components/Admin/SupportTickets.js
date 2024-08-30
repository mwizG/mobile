// src/components/Admin/SupportTickets.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SupportTickets() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        async function fetchTickets() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/tickets/');
                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        }
        fetchTickets();
    }, []);

    const updateTicketStatus = async (ticketId, status) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/admin/ticket/${ticketId}/update/`, { status });
            setTickets(tickets.map(ticket => ticket.id === ticketId ? { ...ticket, status } : ticket));
        } catch (error) {
            console.error('Error updating ticket status:', error);
        }
    };

    return (
        <div>
            <h2>Support Tickets</h2>
            <ul>
                {tickets.map(ticket => (
                    <li key={ticket.id}>
                        {ticket.issue} - Status: {ticket.status}
                        <button onClick={() => updateTicketStatus(ticket.id, 'Resolved')}>Mark as Resolved</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SupportTickets;
