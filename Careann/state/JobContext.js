import React, { createContext, useState, useEffect } from 'react';
import { get, del, post, patch } from '../services/api'; // Assume these functions are defined in api.js for making API calls
import { useNavigate } from 'react-router-dom';

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate(); // Use navigate for redirections if needed

  // Fetch all jobs based on a flag (if it should fetch all jobs or only open jobs)
  const fetchJobs = async (fetchAll = false) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = fetchAll ? 'jobs/all-jobs/' : 'jobs/open-jobs/';
      const response = await get(endpoint);
      setJobs(response.data);
    } catch (error) {
      setError('Error fetching jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch job details by ID
  const fetchJobById = async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await get(`/jobs/${jobId}/`);
      setSelectedJob(response.data);
    } catch (error) {
      setError('Error fetching job by ID');
      console.error('Error fetching job by ID:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch job application by ID
  const fetchApplicationById = async (applicationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await get(`/jobs/applications/${applicationId}/`);
      setApplication(response.data);
      setUserRole(localStorage.getItem('role')); // Fetch the role of the user from local storage
    } catch (error) {
      setError('Error fetching application by ID');
      console.error('Error fetching application by ID:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all applications for a job by job ID
  const fetchApplicationsForJob = async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await get(`/jobs/${jobId}/applications/`);
      setApplications(response.data);
    } catch (error) {
      setError('Error fetching job applications');
      console.error('Error fetching job applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await patch(`/jobs/applications/${applicationId}/`, { status: newStatus });
      setApplication((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      setError('Error updating application status');
      console.error('Error updating application status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Propose a new time for a job application
  const proposeTimeUpdate = async (jobId, proposedTime) => {
    setLoading(true);
    setError(null);
    try {
      await patch(`/jobs/${jobId}/propose-time/`, { proposed_time: proposedTime });
      // If successful, fetch the updated job details
      const updatedJob = await get(`/jobs/${jobId}/`);
      setSelectedJob(updatedJob.data);
    } catch (error) {
      setError('Error proposing new time');
      console.error('Error proposing new time:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete job by ID
  const deleteJob = async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      await del(`/jobs/${jobId}/`);
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId)); // Remove deleted job from the list
    } catch (error) {
      setError('Error deleting job');
      console.error('Error deleting job:', error);
    } finally {
      setLoading(false);
    }
  };

  // Go to Caregiver profile
  const goToCaregiverProfile = (caregiverId) => {
    if (caregiverId) {
      navigate(`/caregiver/${caregiverId}`);
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        selectedJob,
        application,
        applications,
        loading,
        error,
        fetchJobs,
        fetchJobById,
        fetchApplicationById,
        fetchApplicationsForJob,
        updateApplicationStatus,
        proposeTimeUpdate,
        deleteJob,
        goToCaregiverProfile,
        setSelectedJob,
        setApplication,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
