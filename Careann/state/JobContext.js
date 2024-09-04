import React, { createContext, useState, useEffect } from 'react';
import { get } from '../services/api'; // Import the `get` function from api.js

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await get('/jobs/search/'); // Use the `get` function from api.js
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch job by ID
  const fetchJobById = async (jobId) => {
    try {
      const response = await get(`/jobs/${jobId}/`); // Use the `get` function from api.js
      setSelectedJob(response.data);
    } catch (error) {
      console.error('Error fetching job by ID:', error);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, selectedJob, loading, fetchJobById, setSelectedJob }}>
      {children}
    </JobContext.Provider>
  );
};
