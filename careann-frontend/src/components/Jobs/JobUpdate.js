import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function JobUpdate() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState(''); // Job status controlled by the caregiver
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login'); // Redirect to login if no token
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${jobId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setJob(response.data);
                setStatus(response.data.status); // Set the initial status
            } catch (error) {
                setError('Error fetching job details.');
            }
        };

        const role = localStorage.getItem('role');
        setUserRole(role);

        fetchJob();
    }, [jobId, navigate]);

    // Caregiver completes the job, sets status to "Awaiting Approval"
    const completeJob = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/api/jobs/${jobId}/update-status/`, { status: 'Awaiting Approval' }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setStatus('Awaiting Approval'); // Update the local state to reflect the new status
            alert('Job status updated to "Awaiting Approval". Awaiting care seeker approval.');
        } catch (error) {
            setError('Error updating job status.');
        }
    };

    // Care Seeker approves or rejects job completion
    const updateSeekerStatus = async (newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/api/jobs/${jobId}/approve-completion/`, { status: newStatus }, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (newStatus === 'Completed') {
                // Redirect to review page after approval
                navigate(`/jobs/${jobId}/review`);
            } else if (newStatus === 'In Progress') {
                // If rejected, revert to "In Progress"
                setStatus('In Progress');
            }
        } catch (error) {
            setError('Error approving or rejecting job status.');
        }
    };

    // Caregiver reviews the care seeker after the job is marked completed
    const redirectToReviewCareSeeker = () => {
        navigate(`/jobs/${jobId}/review-care-seeker`);
    };

    if (!job) return <div>Loading job details...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="job-detail-container">
            <h2>{job.title}</h2>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Status:</strong> {status}</p>

            {/* Caregiver can click to complete the job and set status to "Awaiting Approval" */}
            {userRole === 'caregiver' && job.status !== 'Completed' && job.status !== 'Awaiting Approval' && (
                <button onClick={completeJob}>Complete Job</button>
            )}

            {/* Care Seeker can choose between "Approve" and "Reject" when job is awaiting approval */}
            {userRole === 'care_seeker' && job.status === 'Awaiting Approval' && (
                <div>
                    <label>Approve or Reject Completion:</label>
                    <select
                        value={status}
                        onChange={(e) => updateSeekerStatus(e.target.value)}
                    >
                        <option value="Completed">Approve (Completed)</option>
                        <option value="In Progress">Reject (In Progress)</option>
                    </select>
                </div>
            )}

            {/* Caregiver reviews care seeker after the job is marked completed */}
            {userRole === 'caregiver' && job.status === 'Completed' && (
                <button onClick={redirectToReviewCareSeeker}>Review Care Seeker</button>
            )}
        </div>
    );
}

export default JobUpdate;
