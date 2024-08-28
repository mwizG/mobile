import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/Api';

function CaregiverJobSearch() {
  const [jobs, setJobs] = useState([]);
  const [searchParams, setSearchParams] = useState({
    location: '',
    careType: '',
    payRate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await apiGet('/jobs/search/', token, searchParams);
        setJobs(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load jobs');
        setLoading(false);
      }
    };
    fetchJobs();
  }, [searchParams, token]);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  };

  const handleApply = async (jobId) => {
    try {
      const url = `/jobs/${jobId}/apply/`;
      const data = {};  // The data being sent (currently empty in this case)
      const token = localStorage.getItem('token');
  
      // Log the request details
      console.log('Applying for job:', jobId);
      console.log('URL:', url);
      console.log('Data:', data);
      console.log('Token:', token);
  
      // Make the POST request
      await apiPost(url, data, token);
      alert('Applied successfully');
    } catch (err) {
      if (err.response && err.response.data) {
        console.error('Error applying for job:', err.response.data);
        setError(JSON.stringify(err.response.data));  // Display the actual error message
      } else {
        console.error('Error applying for job:', err.message);
        setError('Failed to apply for the job');
      }
    }
  };
  
  return (
    <div className="job-search-container">
      <h2>Search Job Listings</h2>
      <form onSubmit={handleSearchSubmit}>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={searchParams.location}
            onChange={handleSearchChange}
          />
        </div>
        <div>
          <label>Care Type</label>
          <input
            type="text"
            name="careType"
            value={searchParams.careType}
            onChange={handleSearchChange}
          />
        </div>
        <div>
          <label>Pay Rate</label>
          <input
            type="text"
            name="payRate"
            value={searchParams.payRate}
            onChange={handleSearchChange}
          />
        </div>
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job.id} className="job-item">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p>Location: {job.location}</p>
              <p>Pay Rate: {job.payRate}</p>
              <button onClick={() => handleApply(job.id)}>Apply</button>  {/* Apply button with handler */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CaregiverJobSearch;
