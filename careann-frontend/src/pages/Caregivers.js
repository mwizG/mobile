import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CaregiverDetail() {
    const { caregiverId } = useParams(); // Get caregiver ID from URL params
    const [caregiver, setCaregiver] = useState(null);

    useEffect(() => {
        const fetchCaregiver = async () => {
            try {
                const token = localStorage.getItem('accessToken'); 
                const response = await axios.get(`http://127.0.0.1:8000/api/accounts/caregivers/${caregiverId}/`, {
                    headers: {
                       Authorization: `Bearer ${token}`,
                    },
                });
                setCaregiver(response.data);
            } catch (error) {
                console.error('Error fetching caregiver details:', error);
            }
        };

        fetchCaregiver();
    }, [caregiverId]);

    if (!caregiver) {
        return <div>Loading caregiver details...</div>;
    }

    return (
        <div className="caregiver-detail-container">
            <h2>{caregiver.username}</h2>
            <p><strong>Email:</strong> {caregiver.email}</p>
            <p><strong>Location:</strong> {caregiver.location || 'Not provided'}</p>
            <p><strong>Experience Categories:</strong> {caregiver.experience_categories || 'No categories provided'}</p>
            <p><strong>Certifications:</strong> {caregiver.certifications || 'No certifications'}</p>
            <p><strong>Availability:</strong> {caregiver.availability || 'Not available'}</p>
            <p><strong>Average Rating:</strong> {caregiver.average_rating ? caregiver.average_rating.toFixed(2) : 'No rating yet'}</p>
            <p><strong>Number of Ratings:</strong> {caregiver.rating_count}</p>
        </div>
    );
}

export default CaregiverDetail;
