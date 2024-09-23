import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function JobListingManager() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // For navigation

    // Fetch jobs posted by the care seeker
    const fetchJobs = async () => {
        setLoading(true);
        setError(null);  // Reset error state before fetching

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/jobs/all-jobs/', {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setJobs(response.data);  // Update jobs state with fetched data
        } catch (error) {
            setError('Error fetching jobs.');
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);  // Stop loading after the fetch is complete
        }
    };

    // Fetch jobs when the component mounts
    useEffect(() => {
        fetchJobs();
    }, []);

    // Handle job deletion
    const handleDelete = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/api/jobs/${jobId}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            // Remove job from local state after successful deletion
            setJobs(jobs.filter(job => job.id !== jobId));
        } catch (error) {
            console.error('Error deleting job:', error);
            setError('Failed to delete the job.');
        }
    };

    if (loading) {
        return <p>Loading jobs...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="job-listing-manager-container">
            <h2>Your Posted Jobs</h2>

            {/* If there are no jobs */}
            {jobs.length === 0 ? (
                <p>No jobs posted yet.</p>
            ) : (
                <ul>
                    {jobs.map(job => (
                        <li key={job.id} className="job-item">
                            <p><strong>Title:</strong> {job.title}</p>
                            <p><strong>Location:</strong> {job.location}</p>

                            {/* View Job Details */}
                            <button onClick={() => navigate(`/care-seeker/jobs/${job.id}`)}>
                                View Details
                            </button>

                            {/* View Applications */}
                            <button onClick={() => navigate(`/care-seeker/jobs/${job.id}/applications`)}>
                                View Applications
                            </button>

                            {/* Delete Job */}
                            <button onClick={() => handleDelete(job.id)}>
                                Delete Job
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Button to post a new job */}
            <button onClick={() => navigate('/care-seeker/post-job')}>
                Post a Job
            </button>
        </div>
    );
}

export default JobListingManager;
