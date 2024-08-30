// src/components/Forms/SearchCaregiversForm.js
import React, { useState } from 'react';
import axios from 'axios';

function SearchCaregiversForm() {
    const [location, setLocation] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [availability, setAvailability] = useState('');
    const [experience, setExperience] = useState('');
    const [caregivers, setCaregivers] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get('http://your-backend-api-url/api/caregivers/search/', {
                params: {
                    location,
                    service_type: serviceType,
                    availability,
                    experience
                }
            });
            setCaregivers(response.data);
        } catch (error) {
            console.error('Error searching for caregivers', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Search for Caregivers</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Service Type"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Availability"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            <div>
                <h3>Search Results</h3>
                {loading ? <p>Loading...</p> : null}
                {!loading && caregivers.length === 0 ? <p>No caregivers found.</p> : null}
                <ul>
                    {caregivers.map((caregiver) => (
                        <li key={caregiver.id}>
                            <strong>{caregiver.username}</strong> - {caregiver.experience} years experience
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SearchCaregiversForm;
