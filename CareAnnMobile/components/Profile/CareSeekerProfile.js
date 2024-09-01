// src/components/CareSeekerProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CareSeekerProfile() {
    const [profile, setProfile] = useState({
        location: '',
        bio: '',
        health_status: '',
        contact_info: '',
        profile_image: null,
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://your-backend-api-url/api/profile/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile', error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        setProfile({
            ...profile,
            profile_image: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            for (let key in profile) {
                formData.append(key, profile[key]);
            }
            await axios.put('http://your-backend-api-url/api/profile/', formData, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    return (
        <div className="profile-container">
            <h2>Manage Profile</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Location:</label>
                    <input name="location" value={profile.location} onChange={handleChange} />
                </div>
                <div>
                    <label>Bio:</label>
                    <textarea name="bio" value={profile.bio} onChange={handleChange} />
                </div>
                <div>
                    <label>Health Status:</label>
                    <textarea name="health_status" value={profile.health_status} onChange={handleChange} />
                </div>
                <div>
                    <label>Contact Info:</label>
                    <input name="contact_info" value={profile.contact_info} onChange={handleChange} />
                </div>
                <div>
                    <label>Profile Image:</label>
                    <input type="file" name="profile_image" onChange={handleImageChange} />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
}

export default CareSeekerProfile;
