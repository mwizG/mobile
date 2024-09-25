import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function JobApplicationList() {
    const { jobId } = useParams();  // Extract jobId from the URL
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('User not authenticated');
                    return;
                }

                // Fetch all applications from the API
                const response = await axios.get('http://127.0.0.1:8000/api/jobs/applications/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                // Filter applications by the provided jobId (if it exists)
                const filteredApplications = jobId
                    ? response.data.filter(application => application.job === parseInt(jobId))
                    : response.data;

                setApplications(filteredApplications);
            } catch (error) {
                console.error('Error fetching job applications:', error);
                setError('Error fetching job applications.');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [jobId]);

    const handleViewDetails = (applicationId) => {
        // Navigate to the JobApplicationUpdate page and pass the applicationId
        navigate(`/care-seeker/applications/${applicationId}`);
    };

    if (loading) {
        return <p>Loading applications...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="job-application-list">
            {applications.length === 0 ? (
                <p>No applications found for this job.</p>
            ) : (
                <ul>
                    {applications.map((application) => (
                        <li key={application.id}>
                            <p><strong>Job:</strong> {application.job_title}</p>
                            <p><strong>Applicant:</strong> {application.caregiver}</p>
                            <p><strong>Status:</strong> {application.status}</p>
                            <button onClick={() => handleViewDetails(application.id)}>View Details</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default JobApplicationList;
