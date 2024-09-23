import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function JobDetail() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [userRole, setUserRole] = useState('');
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
        }
    };

    const handleApplyClick = () => {
        navigate(`/caregiver/jobs/${jobId}/apply`);
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

            {/* Only caregivers can accept proposed time */}
            {userRole === 'caregiver' && job.proposed_time && (
                <button onClick={acceptJobTime}>Accept Proposed Time</button>
            )}

            {/* Only caregivers can apply for open jobs */}
            {userRole === 'caregiver' && job.status === 'Open' && (
                <button onClick={handleApplyClick}>Apply for Job</button>
            )}
        </div>
    );
}

export default JobDetail;
