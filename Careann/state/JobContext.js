import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api'; // Assuming you have an api.js file for API calls

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs/');
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const fetchJobById = async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}/`);
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
