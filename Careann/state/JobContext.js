import React, { createContext, useState, useEffect } from 'react';
import { get, del } from '../services/api'; // Import the `get` and `del` functions from api.js

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state for better handling

  // Fetch all jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await get('/jobs/search/'); // Use the `get` function from api.js
      setJobs(response.data);
      console.log(response.data);
    } catch (error) {
      setError('Error fetching jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch job by ID
  const fetchJobById = async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await get(`/jobs/${jobId}/`); // Use the `get` function from api.js
      setSelectedJob(response.data);
    } catch (error) {
      setError('Error fetching job by ID');
      console.error('Error fetching job by ID:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete job by ID
  const deleteJob = async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      await del(`/jobs/${jobId}/`); // Use the `del` function from api.js
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId)); // Remove deleted job from the list
    } catch (error) {
      setError('Error deleting job');
      console.error('Error deleting job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, selectedJob, loading, error, fetchJobs, fetchJobById, deleteJob, setSelectedJob }}>
      {children}
    </JobContext.Provider>
  );
};
