import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function JobDetail() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    navigate('/login'); // Redirect to login if no token
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${jobId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
                setError('Error fetching job details.');
            }
        };

        const role = localStorage.getItem('role');
        if (role) {
            setUserRole(role);
        } else {
            console.error('User role not found');
        }

        fetchJob();
    }, [jobId, navigate]);

    const acceptJobTime = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/api/jobs/${jobId}/accept-time/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            navigate('/tasks');  // Redirect after accepting job time
        } catch (error) {
            console.error('Error accepting job time', error);
            setError('Error accepting job time.');
        }
    };

    const handleApplyClick = () => {
        navigate(`/caregiver/jobs/${jobId}/apply`);
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
            <p><strong>Proposed Time:</strong> {job.proposed_time ? new Date(job.proposed_time).toLocaleString() : 'N/A'}</p>

            <div>
                {/* Caregiver can accept proposed time only when the job is accepted and a proposed time exists */}
                {userRole === 'caregiver' && job.applicatstatus === 'Accepted' && job.proposed_time && (
                    <button onClick={acceptJobTime}>Accept Proposed Time</button>
                )}

                {/* Caregiver can apply for open jobs only if they haven't applied yet */}
                {userRole === 'caregiver' && job.status === 'Open' && (
                    !job.has_applied ? (
                        <button onClick={handleApplyClick}>Apply for Job</button>
                    ) : (
                        <p>You've already applied for this job.</p>
                    )
                )}
            </div>
        </div>
    );
}

export default JobDetail;
