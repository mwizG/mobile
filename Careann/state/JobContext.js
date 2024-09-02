import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../services/api'; // Assuming you have an api.js file for API calls

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${api.baseURL}/jobs/`);
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
            const response = await axios.get(`${api.baseURL}/jobs/${jobId}/`);
            setSelectedJob(response.data);
        } catch (error) {
            console.error('Error fetching job by ID:', error);
        }
    };

    const postJob = async (jobData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${api.baseURL}/jobs/create/`, jobData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setJobs([...jobs, response.data]);
        } catch (error) {
            console.error('Error posting job:', error);
        }
    };

    const applyForJob = async (jobId, applicationData) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${api.baseURL}/jobs/${jobId}/apply/`, applicationData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
        } catch (error) {
            console.error('Error applying for job:', error);
        }
    };

    return (
        <JobContext.Provider value={{ jobs, selectedJob, loading, fetchJobById, postJob, applyForJob }}>
            {children}
        </JobContext.Provider>
    );
};
