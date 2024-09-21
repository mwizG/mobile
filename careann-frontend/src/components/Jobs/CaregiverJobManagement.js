// src/components/CaregiverJobManagement.js

import { Link } from 'react-router-dom'; // Add this line to import Link

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CaregiverJobManagement() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/jobs/caregiver-jobs/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs', error);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="job-management-container">
            <h2>My Assigned Jobs</h2>
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <Link to={`/caregiver/jobs/${job.id}`}>
                            <strong>{job.title}</strong> - {job.location} - {new Date(job.proposed_time).toLocaleString()}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CaregiverJobManagement;
