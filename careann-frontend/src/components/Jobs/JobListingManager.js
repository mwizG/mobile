import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function JobListingManager() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // For navigation

    // Debug: Check if the ID is retrieved correctly
    const currentUserId = parseInt(localStorage.getItem('user_id'), 10);  // Ensure ID is an integer
    console.log("Current User ID:", currentUserId);  // Debug log

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

            console.log("Jobs received:", response.data);  // Log the jobs received from the API

            // Filter the jobs to only include those posted by the current care seeker
            if (currentUserId) {
                const filteredJobs = response.data.filter(job => job.care_seeker.id === currentUserId);
                setJobs(filteredJobs);  // Update jobs state with filtered data
            } else {
                console.error("User ID is null. Cannot filter jobs.");
                setJobs([]);  // Set jobs to an empty array if user ID is missing
            }
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

                            <button onClick={() => navigate(`/care-seeker/jobsUp/${job.id}`)}>
                                Job State Approvals
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
