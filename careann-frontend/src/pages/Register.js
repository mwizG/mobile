import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    is_care_seeker: false,
    is_caregiver: false,
    location: '',
    bio: '',
    experience: '',
    certifications: '',
    availability: '',
    profile_image: null,
    payment_preference: '',
    experience_categories: '',
    health_status: '',
    contact_info: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    try {
      await axios.post('http://your-backend-api-url/api/accounts/register/', data);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {/* Fields for registration */}
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />

        {/* Radio buttons to select Care Seeker or Caregiver */}
        <div>
          <label>
            <input
              type="radio"
              name="is_care_seeker"
              value={true}
              onChange={() => setFormData({ ...formData, is_care_seeker: true, is_caregiver: false })}
            />
            Care Seeker
          </label>
          <label>
            <input
              type="radio"
              name="is_caregiver"
              value={true}
              onChange={() => setFormData({ ...formData, is_care_seeker: false, is_caregiver: true })}
            />
            Caregiver
          </label>
        </div>

        {/* Conditional fields based on role */}
        {formData.is_care_seeker && (
          <>
            <input type="text" name="location" placeholder="Location" onChange={handleChange} />
            <input type="text" name="health_status" placeholder="Health Status" onChange={handleChange} />
            <input type="text" name="contact_info" placeholder="Contact Info" onChange={handleChange} />
          </>
        )}

        {formData.is_caregiver && (
          <>
            <input type="text" name="experience" placeholder="Experience" onChange={handleChange} />
            <input type="text" name="certifications" placeholder="Certifications" onChange={handleChange} />
            <input type="text" name="availability" placeholder="Availability" onChange={handleChange} />
            <input type="text" name="payment_preference" placeholder="Payment Preference" onChange={handleChange} />
            <input type="text" name="experience_categories" placeholder="Experience Categories" onChange={handleChange} />
          </>
        )}

        <input type="file" name="profile_image" onChange={handleFileChange} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
