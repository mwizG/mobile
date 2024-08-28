// src/components/CaregiverProfile.js
import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/Api';

function CaregiverProfile() {
  const [profile, setProfile] = useState({
    experience: '',
    certifications: '',
    availability: '',
    payRate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiGet('/caregiver/profile/', token);
        setProfile(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiPost('/caregiver/profile/', profile, token);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Caregiver Profile</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Experience</label>
          <textarea
            name="experience"
            value={profile.experience}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>Certifications</label>
          <textarea
            name="certifications"
            value={profile.certifications}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>Availability</label>
          <input
            type="text"
            name="availability"
            value={profile.availability}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Pay Rate</label>
          <input
            type="text"
            name="payRate"
            value={profile.payRate}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default CaregiverProfile;
