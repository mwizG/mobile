// src/components/Jobs/JobApplicationUpdate.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function JobApplicationUpdate() {
  const { pk } = useParams(); // Get the application ID from the URL
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/jobs/applications/${pk}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setApplication(response.data);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching job application details', error);
      }
    };

    fetchApplication();
  }, [pk]);

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:8000/api/jobs/applications/${pk}/`, { status }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      navigate('/care-seeker/applications'); // Redirect after update
    } catch (error) {
      console.error('Error updating job application', error);
    }
  };

  if (!application) {
    return <div>Loading application details...</div>;
  }

  return (
    <div>
      <h2>Update Job Application</h2>
      <p><strong>Job:</strong> {application.job}</p>
      <p><strong>Caregiver:</strong> {application.caregiver}</p>
      <p><strong>Cover Letter:</strong> {application.cover_letter}</p>
      <p><strong>Applied At:</strong> {new Date(application.applied_at).toLocaleDateString()}</p>
      <p>
        <strong>Status:</strong>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </p>
      <button onClick={handleStatusUpdate}>Update Status</button>
    </div>
  );
}

export default JobApplicationUpdate;
