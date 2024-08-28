// src/components/JobList.js
import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/Api';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await apiGet('/jobs/search/', token);
        setJobs(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load jobs');
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]);

  const handleApply = async (jobId) => {
    try {
      await apiPost(`/jobs/${jobId}/apply/`, {}, token);
      alert('Applied successfully');
    } catch (err) {
      setError('Failed to apply for the job');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="job-list-container">
      <h2>Job Listings</h2>
      {jobs.map((job) => (
        <div key={job.id} className="job-item">
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <button onClick={() => handleApply(job.id)}>Apply</button>
        </div>
      ))}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default JobList;
