
// src/components/JobList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/jobs/search/'); // Adjust the URL based on your backend endpoint
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching job listings:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="job-list-container">
      <h2>Available Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id} className="job-item">
            <Link to={`/jobs/${job.id}`} className="job-link">
              <h3>{job.title}</h3>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Pay Rate:</strong> ${job.pay_rate}</p>
              <p><strong>Status:</strong> {job.status}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobList;
