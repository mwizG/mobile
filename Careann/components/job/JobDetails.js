import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function JobDetails() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${jobId}/`);
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };

        fetchJob();
    }, [jobId]);

    const acceptJobTime = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(`http://127.0.0.1:8000/api/jobs/${jobId}/accept-time/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            console.log('Job time accepted:', response.data);
            // Optionally, you can update the job state to reflect the accepted time
            setJob(response.data);
        } catch (error) {
            console.error('Error accepting job time', error);
        }
    };

    if (!job) {
        return <div>Loading job details...</div>;
    }

    return (
        <div className="job-detail-container">
            <h2>{job.title}</h2>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Pay Rate:</strong> ${job.pay_rate}</p>
            <p><strong>Status:</strong> {job.status}</p>
            <p><strong>Proposed Time:</strong> {job.proposed_time ? new Date(job.proposed_time).toLocaleString() : 'N/A'}</p>
            {job.proposed_time && (
                <button onClick={acceptJobTime}>Accept Proposed Time</button>
            )}
        </div>
    );
}

export default JobDetails;