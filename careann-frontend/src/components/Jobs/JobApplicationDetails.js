import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function JobApplicationDetail() {
    const { id } = useParams(); // Get the job ID from the URL
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [userRole, setUserRole] = useState(''); // State for the user's role
    const [error, setError] = useState(''); // Error state for handling issues

    useEffect(() => {
        // Fetch the job details
        const fetchJob = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found. Please log in.');
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setJob(response.data);
            } catch (error) {
                setError('Error fetching job details');
                console.error('Error fetching job details:', error);
            }
        };

        // Fetch the user role from localStorage
        const role = localStorage.getItem('role');
        if (role) {
            setUserRole(role);
        } else {
            console.error('User role not found');
        }

        fetchJob();
    }, [id]);

    // Handle job acceptance by caregivers
    const handleAcceptJobTime = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in.');
                return;
            }

            // Send PATCH request to accept the job
            const response = await axios.patch(`http://127.0.0.1:8000/api/jobs/${id}/accept/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (response.status === 200) {
                navigate('/caregiver-jobs'); // Redirect to caregiver jobs page after accepting the job
            } else {
                setError('Failed to accept the job.');
            }
        } catch (error) {
            setError('Error accepting the job');
            console.error('Error accepting the job:', error);
        }
    };

    // Handle job decline by caregivers
    const handleDeclineJob = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in.');
                return;
            }

            const response = await axios.patch(`http://127.0.0.1:8000/api/jobs/${id}/decline/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (response.status === 200) {
                navigate('/caregiver-jobs'); // Redirect to caregiver jobs page after declining the job
            } else {
                setError('Failed to decline the job.');
            }
        } catch (error) {
            setError('Error declining the job');
            console.error('Error declining the job:', error);
        }
    };

    if (!job) {
        return <div>Loading job details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="job-detail-container">
            <h2>{job.title}</h2>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Pay Rate:</strong> K{job.pay_rate}</p>
            <p><strong>Status:</strong> {job.status}</p>
            <p><strong>Scheduled Time:</strong> {new Date(job.scheduled_time).toLocaleString()}</p>

            <div>
                {/* Only caregivers should be able to accept or decline jobs */}
                {userRole === 'caregiver' && job.status === 'Open' && (
                    <>
                        <button onClick={handleAcceptJobTime}>Accept Job</button>
                        <button onClick={handleDeclineJob}>Decline Job</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default JobApplicationDetail;
