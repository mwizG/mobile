// src/pages/CaregiverSchedule.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CaregiverSchedule() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        // Fetch scheduled jobs
        const fetchScheduledJobs = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/jobs/scheduled/');
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching scheduled jobs:', error);
            }
        };

        fetchScheduledJobs();
    }, []);

    return (
        <div>
            <h2>Manage Your Schedule</h2>
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <strong>{job.title}</strong> - Scheduled for {job.scheduled_time}
                        <br />
                        <strong>Location:</strong> {job.location}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CaregiverSchedule;
