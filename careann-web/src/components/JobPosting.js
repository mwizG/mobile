import React, { useState } from 'react';
import { apiPost } from '../utils/Api';

function JobPosting() {
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    location: '',
    job_type: '',  // Add job_type field
    payRate: '',   // Ensure this is a valid decimal
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setJobDetails({
      ...jobDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');  // Get the token from localStorage

    if (!token) {
      setError('You must be logged in to post a job');
      return;
    }

    try {
      // Convert payRate to a string that represents a decimal value
      const formattedJobDetails = {
        ...jobDetails,
        pay_rate: parseFloat(jobDetails.payRate).toFixed(2),  // Ensure pay_rate is a decimal
      };

      await apiPost('/jobs/create/', formattedJobDetails, token);
      alert('Job posted successfully');
      setError('');  // Clear any previous errors
    } catch (error) {
      console.error('Error posting job:', error.response ? error.response.data : error.message);
      setError(error.response && error.response.data ? JSON.stringify(error.response.data) : 'Failed to post job. Please try again.');
    }
  };

  return (
    <div className="job-posting-container">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={jobDetails.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={jobDetails.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={jobDetails.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Job Type</label>
          <input
            type="text"
            name="job_type"
            value={jobDetails.job_type}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Pay Rate</label>
          <input
            type="text"
            name="payRate"
            value={jobDetails.payRate}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Post Job</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default JobPosting;
