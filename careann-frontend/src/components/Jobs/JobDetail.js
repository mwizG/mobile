import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function JobDetail() {
  const { jobId } = useParams(); // Correctly get jobId from the URL
  const [job, setJob] = useState(null);
  const navigate = useNavigate(); // For navigating to the application form

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${jobId}/`); // Use jobId in the API request
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  if (!job) {
    return <div>Loading job details...</div>;
  }

  const handleApply = () => {
    navigate(`/caregiver/jobs/${jobId}/apply`); // Navigate to the job application form
  };

  return (
    <div className="job-detail-container">
      <h2>{job.title}</h2>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Pay Rate:</strong> K{job.pay_rate}</p>
      <p><strong>Status:</strong> {job.status}</p>
      <p><strong>Created At:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
      
      <button onClick={handleApply}>Apply for this Job</button> {/* Apply button */}
    </div>
  );
}

export default JobDetail;
