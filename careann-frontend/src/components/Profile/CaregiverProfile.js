// src/components/CaregiverProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel, Button, Box, TextField } from '@mui/material';

const experienceOptions = [
    'Respite Care',
    'Home Care',
    'Senior Care',
    'Child Care',
    'Disability Care',
    'Palliative Care',
    'Post-Surgical Care',
    'Maternity Care',
    'Dementia Care',
];

function CaregiverProfile() {
    const [profile, setProfile] = useState({
        experience: '',
        certifications: '',
        availability: '',
        payment_preference: '',
        experience_categories: '',  // Consider making this an array if needed
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
                <Box sx={{ mb: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="experience-label">Experience</InputLabel>
                        <Select
                            labelId="experience-label"
                            name="experience"
                            value={profile.experience}
                            onChange={handleChange}
                        >
                            {experienceOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <TextField
                    label="Certifications"
                    name="certifications"
                    value={profile.certifications}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Availability"
                    name="availability"
                    value={profile.availability}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Payment Preference"
                    name="payment_preference"
                    value={profile.payment_preference}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Experience Categories"
                    name="experience_categories"
                    value={profile.experience_categories}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Comma separated values"
                />
                <div>
                    <label>Profile Image:</label>
                    <input type="file" name="profile_image" onChange={handleImageChange} />
                </div>
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Update Profile
                </Button>
            </form>
        </div>
    );
}

export default CaregiverProfile;
