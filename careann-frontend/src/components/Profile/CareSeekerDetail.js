import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CareSeekerDetail() {
    const { careSeekerId } = useParams(); // Get care seeker ID from URL params
    const [careSeeker, setCareSeeker] = useState(null);

    useEffect(() => {
        const fetchCareSeeker = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:8000/api/accounts/careseekers/${careSeekerId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setCareSeeker(response.data);
            } catch (error) {
                console.error('Error fetching care seeker details', error);
            }
        };

        fetchCareSeeker();
    }, [careSeekerId]);

    if (!careSeeker) {
        return <div>Loading care seeker details...</div>;
    }

    return (
        <div className="careseeker-detail-container">
            <h2>{careSeeker.username}</h2>
            <p><strong>Email:</strong> {careSeeker.email}</p>
            <p><strong>Location:</strong> {careSeeker.location || 'Not provided'}</p>
            <p><strong>Health Status:</strong> {careSeeker.health_status || 'No health status provided'}</p>
            <p><strong>Contact Info:</strong> {careSeeker.contact_info || 'No contact info provided'}</p>
            {/* Add more fields if necessary based on the care seeker's profile */}
        </div>
    );
}

export default CareSeekerDetail;
