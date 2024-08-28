// src/components/JobPosting.js
import React, { useState } from 'react';
import { apiPost } from '../utils/Api';

function JobPosting() {
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    location: '',
    payRate: '',
  });

  const handleChange = (e) => {
    setJobDetails({
      ...jobDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost('/jobs/', jobDetails);
      alert('Job posted successfully');
    } catch (error) {
      console.error('Error posting job', error);
    }
  };

  return (
    <div className="job-posting-container">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title</label>
          <input type="text" name="title" value={jobDetails.title} onChange={handleChange} />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={jobDetails.description} onChange={handleChange}></textarea>
        </div>
        <div>
          <label>Location</label>
          <input type="text" name="location" value={jobDetails.location} onChange={handleChange} />
        </div>
        <div>
          <label>Pay Rate</label>
          <input type="text" name="payRate" value={jobDetails.payRate} onChange={handleChange} />
        </div>
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}

export default JobPosting;
