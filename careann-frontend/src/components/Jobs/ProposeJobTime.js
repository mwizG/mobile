// src/components/Jobs/ProposeJobTime.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ProposeJobTime() {
  const { id } = useParams(); // Get the job ID from the URL
  const navigate = useNavigate();
  const [proposedTime, setProposedTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken'); 

      // Log the token and request details
      console.log('Token:', token);
      console.log('Job ID:', id);
      console.log('Proposed Time:', proposedTime);
      

      const response = await axios.patch(
        `http://127.0.0.1:8000/api/jobs/${id}/propose-time/`,
        { proposed_time: proposedTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/care-seeker/jobs/${id}`); // Redirect to job details after proposing time
    } catch (error) {
      console.error('Error proposing job time', error);
    }
  };

  return (
    <div>
      <h2>Propose Job Time</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Proposed Time:
          <input
            type="datetime-local"
            value={proposedTime}
            onChange={(e) => setProposedTime(e.target.value)}
            required
          />
        </label>
        <button type="submit">Propose Time</button>
      </form>
    </div>
  );
}

export default ProposeJobTime;
