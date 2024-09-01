import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function JobApplicationDetail() {
    const { id } = useParams(); // Get the application ID from the URL
    const navigate = useNavigate();
    const [job, setJob] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details', error);
            }
        };

        fetchJob();
    }, [id]);

    const handleAcceptJob = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/api/jobs/${id}/accept/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            navigate('/caregiver-jobs'); // Redirect to the caregiver jobs page after accepting
        } catch (error) {
            console.error('Error accepting the job', error);
        }
    };

    const handleDeclineJob = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/api/jobs/${id}/decline/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            navigate('/caregiver-jobs'); // Redirect to the caregiver jobs page after declining
        } catch (error) {
            console.error('Error declining the job', error);
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
            <p><strong>Scheduled Time:</strong> {new Date(job.scheduled_time).toLocaleString()}</p>

            <div>
                <button onClick={handleAcceptJob} disabled={job.status !== 'Open'}>Accept Job</button>
                <button onClick={handleDeclineJob} disabled={job.status !== 'Open'}>Decline Job</button>
            </div>
        </div>
    );
}

export default JobApplicationDetail;
