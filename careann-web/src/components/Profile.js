import React, { useState, useEffect } from 'react';
import { apiGet, apiPut } from '../utils/Api';  // Ensure apiPut is imported

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiGet('/accounts/profile/', token);
        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error(err);  // Log error for debugging
        setError('Failed to load profile');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiPut('/accounts/profile/', profile, token);
      alert('Profile updated successfully');
    } catch (err) {
      console.error(err);  // Log error for debugging
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Location</label>
          <input
            type="text"
            value={profile.location || ''}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
          />
        </div>
        <div>
          <label>Bio</label>
          <textarea
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>
        <button type="submit">Update Profile</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Profile;
