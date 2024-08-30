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

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      is_care_seeker: role === 'care_seeker',
      is_caregiver: role === 'caregiver',
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_image: e.target.files[0], // Ensure this is the file object
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) { // Ensure the field is not null or undefined before appending
        data.append(key, formData[key]);
      }
    });

    // Convert FormData to an array of key-value pairs and log it
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/accounts/register/', data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Registration failed:', error.response.data);
      } else {
        console.error('Registration failed', error);
      }
    }
};

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        {/* Radio buttons to select Care Seeker or Caregiver */}
        <div>
          <label>
            <input
              type="radio"
              name="role"
              value="care_seeker"
              checked={formData.is_care_seeker}
              onChange={() => handleRoleChange('care_seeker')}
            />
            Care Seeker
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="caregiver"
              checked={formData.is_caregiver}
              onChange={() => handleRoleChange('caregiver')}
            />
            Caregiver
          </label>
        </div>

        {/* Conditional fields based on role */}
        {formData.is_care_seeker && (
          <>
            <input
              type="text"
              name="location"
              placeholder="Location"
              onChange={handleChange}
            />
            <input
              type="text"
              name="health_status"
              placeholder="Health Status"
              onChange={handleChange}
            />
            <input
              type="text"
              name="contact_info"
              placeholder="Contact Info"
              onChange={handleChange}
            />
            <textarea
              name="bio"
              placeholder="Tell us more about yourself"
              onChange={handleChange}
            ></textarea>
          </>
        )}

        {formData.is_caregiver && (
          <>
            <input
              type="text"
              name="experience"
              placeholder="Experience"
              onChange={handleChange}
            />
            <input
              type="text"
              name="certifications"
              placeholder="Certifications"
              onChange={handleChange}
            />
            <input
              type="text"
              name="availability"
              placeholder="Availability"
              onChange={handleChange}
            />
            
            <input
              type="text"
              name="payment_preference"
              placeholder="Payment Preference"
              onChange={handleChange}
            />
            <input
              type="text"
              name="experience_categories"
              placeholder="Experience Categories"
              onChange={handleChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              onChange={handleChange}
            />
            <input
              type="text"
              name="contact_info"
              placeholder="Contact Info"
              onChange={handleChange}
            />
            <textarea
              name="bio"
              placeholder="Tell us more about yourself"
              onChange={handleChange}
            ></textarea>
          </>
        )}

        <input type="file" name="profile_image" onChange={handleFileChange} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
