import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function JobApplicationDetail() {
    const { id } = useParams(); // Get the job ID from the URL
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [application, setApplication] = useState(null); // State for the application details
    const [userRole, setUserRole] = useState(''); // State for the user's role
    const [error, setError] = useState(''); // Error state for handling issues

    useEffect(() => {
        const fetchJobAndApplication = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found. Please log in.');
                    return;
                }

                // Fetch job details
                const jobResponse = await axios.get(`http://127.0.0.1:8000/api/jobs/${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setJob(jobResponse.data);

                // Fetch the applications for this job
                const applicationResponse = await axios.get(`http://127.0.0.1:8000/api/jobs/${id}/applications/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                // Get the logged-in user's ID from the token (assuming you have an endpoint to fetch user details)
                const userResponse = await axios.get('http://127.0.0.1:8000/api/accounts/profile', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                const loggedInUserId = userResponse.data.id;

                // Find the application where the logged-in user is the caregiver
                const currentApplication = applicationResponse.data.find(app => app.caregiver_id === loggedInUserId);
                if (currentApplication) {
                    setApplication(currentApplication);
                } else {
                    setError('No accepted application found for this job.');
                }
            } catch (error) {
                setError('Error fetching job or application details');
                console.error('Error fetching job or application details:', error);
            }
        };

        const role = localStorage.getItem('role');
        if (role) {
            setUserRole(role);
        } else {
            console.error('User role not found');
        }

        fetchJobAndApplication();
    }, [id]);

    // Define the handleAcceptJobTime function
    const handleAcceptJobTime = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/api/jobs/${id}/accept/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            alert('Job accepted successfully!');
            navigate('/caregiver-jobs');
        } catch (error) {
            setError('Error accepting the job');
            console.error('Error accepting the job:', error);
        }
    };

    // Define the handleDeclineJob function
    const handleDeclineJob = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/api/jobs/${id}/decline/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            alert('Job declined successfully!');
            navigate('/caregiver-jobs');
        } catch (error) {
            setError('Error declining the job');
            console.error('Error declining the job:', error);
        }
    };

    if (!job || !application) {
        return <div>Loading job and application details...</div>;
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
            <p><strong>Application Status:</strong> {application.status}</p> {/* Show application status */}
            <p><strong>Proposed Time:</strong> {job.proposed_time ? new Date(job.proposed_time).toLocaleString() : 'No proposed time'}</p>

            <div>
                {/* Caregiver can only accept or decline jobs based on accepted status */}
                {userRole === 'caregiver' && application.status === 'Accepted' && (
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
