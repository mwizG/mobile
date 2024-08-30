// src/components/CaregiverProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CaregiverProfile() {
    const [profile, setProfile] = useState({
        experience: '',
        certifications: '',
        availability: '',
        payment_preference: '',
        experience_categories: '',
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
                    <label>Experience:</label>
                    <textarea name="experience" value={profile.experience} onChange={handleChange} />
                </div>
                <div>
                    <label>Certifications:</label>
                    <textarea name="certifications" value={profile.certifications} onChange={handleChange} />
                </div>
                <div>
                    <label>Availability:</label>
                    <input name="availability" value={profile.availability} onChange={handleChange} />
                </div>
                <div>
                    <label>Payment Preference:</label>
                    <input name="payment_preference" value={profile.payment_preference} onChange={handleChange} />
                </div>
                <div>
                    <label>Experience Categories:</label>
                    <input name="experience_categories" value={profile.experience_categories} onChange={handleChange} />
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

export default CaregiverProfile;
