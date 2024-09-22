import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CaregiverList() {
    const [caregivers, setCaregivers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCaregivers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/messaging/caregivers/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setCaregivers(response.data);
            } catch (error) {
                console.error('Error fetching caregivers:', error);
            }
        };
        fetchCaregivers();
    }, []);

    const startConversation = async (caregiverUsername) => {
        try {
            const token = localStorage.getItem('token');
    
            // Fetch existing conversations
            const conversationsResponse = await axios.get('http://127.0.0.1:8000/api/messaging/conversations/', {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
    
            // Check if a conversation with the caregiver already exists
            const existingConversation = conversationsResponse.data.find(conversation =>
                conversation.participants.includes(caregiverUsername)
            );
    
            if (existingConversation) {
                // Navigate to the existing conversation
                navigate(`/conversations/${existingConversation.id}/messages`);
            } else {
                // Start a new conversation if none exists
                const response = await axios.post('http://127.0.0.1:8000/api/messaging/conversations/', {
                    participants: [caregiverUsername]
                }, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
    
                // Navigate to the new conversation's messages
                navigate(`/conversations/${response.data.id}/messages`);
            }
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };
    
    
    

    return (
        <div>
            <h2>Caregivers</h2>
            <ul>
                {caregivers.map(caregiver => (
                    <li key={caregiver.id}>
                        {caregiver.username}
                        <button onClick={() => startConversation(caregiver.username)}>Message</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CaregiverList;
