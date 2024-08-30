// src/components/Schedule/AvailabilityForm.js
import React, { useState } from 'react';
import axios from 'axios';

function AvailabilityForm() {
    const [availability, setAvailability] = useState('');

    const handleUpdateAvailability = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.patch('http://your-backend-api-url/api/caregivers/availability/', {
                availability
            }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            alert('Availability updated successfully!');
        } catch (error) {
            console.error('Error updating availability', error);
        }
    };

    return (
        <div>
            <h2>Manage Availability</h2>
            <form onSubmit={handleUpdateAvailability}>
                <textarea
                    placeholder="Enter your availability details"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                ></textarea>
                <button type="submit">Update Availability</button>
            </form>
        </div>
    );
}

export default AvailabilityForm;
