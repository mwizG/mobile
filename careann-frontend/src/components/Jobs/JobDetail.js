import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

function JobDetail() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [userRole, setUserRole] = useState(''); // State for storing the user's role
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${jobId}/`);
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };

        // Fetch the user role from localStorage or another source (e.g., API)
        const role = localStorage.getItem('role'); // Assuming the role is stored in localStorage
        if (role) {
            setUserRole(role);
        } else {
            console.error('User role not found');
        }

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
            setJob(response.data); // Update the job state to reflect the accepted time
            
            navigate('/tasks');  // Redirect to task
        } catch (error) {
            console.error('Error accepting job time', error);
        }
    };

    const handleApplyClick = () => {
        // Navigate to the job application form
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

            {/* Only caregivers can see the "Accept Proposed Time" button */}
            {userRole === 'caregiver' && job.proposed_time && (
                <button onClick={acceptJobTime}>Accept Proposed Time</button>
            )}

            {/* Conditionally render Apply button for caregivers when job is open */}
            {userRole === 'caregiver' && job.status === 'Open' && (
                <button onClick={handleApplyClick}>Apply for Job</button>
            )}
        </div>
    );
}

export default JobDetail;
