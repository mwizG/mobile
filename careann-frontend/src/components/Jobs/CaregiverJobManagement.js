// src/components/CaregiverJobManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CaregiverJobManagement() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://your-backend-api-url/api/caregiver/jobs/', {
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
            <h2>Your Jobs</h2>
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <h3>{job.title}</h3>
                        <p>{job.description}</p>
                        <p><strong>Status:</strong> {job.status}</p>
                        <p><strong>Scheduled Time:</strong> {job.scheduled_time}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CaregiverJobManagement;
