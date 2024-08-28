// src/components/CaregiverSchedule.js
import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/Api';

function CaregiverSchedule() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await apiGet('/caregiver/schedule/', token);
        setJobs(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load schedule');
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]);

  const handleAccept = async (jobId) => {
    try {
      await apiPost(`/jobs/${jobId}/accept/`, {}, token);
      alert('Job accepted');
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      setError('Failed to accept the job');
    }
  };

  const handleDecline = async (jobId) => {
    try {
      await apiPost(`/jobs/${jobId}/decline/`, {}, token);
      alert('Job declined');
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      setError('Failed to decline the job');
    }
  };

  return (
    <div className="schedule-container">
      <h2>Manage Your Schedule</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="job-list">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="job-item">
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <p>Location: {job.location}</p>
                <p>Scheduled Time: {job.scheduledTime}</p>
                <button onClick={() => handleAccept(job.id)}>Accept</button>
                <button onClick={() => handleDecline(job.id)}>Decline</button>
              </div>
            ))
          ) : (
            <p>No jobs found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CaregiverSchedule;
