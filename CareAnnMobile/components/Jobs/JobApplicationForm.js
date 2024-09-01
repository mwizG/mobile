import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function JobApplicationForm() {
  const { jobId } = useParams(); // Get the job ID from the URL
  const [coverLetter, setCoverLetter] = useState('');
  const navigate = useNavigate(); // For navigating back after submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const requestData = {
        cover_letter: coverLetter,
      };
      const headers = {
        Authorization: `Token ${token}`,
      };

      // Log the request data and headers
      console.log('Request Data:', requestData);
      console.log('Headers:', headers);

      const response = await axios.post(
        `http://127.0.0.1:8000/api/jobs/${jobId}/apply/`,
        requestData,
        { headers }
      );

      // Handle success, such as navigating back to the job list or dashboard
      navigate('/caregiver/dashboard');
    } catch (error) {
      console.error('Error applying for the job:', error);
    }
  };

  return (
    <div className="job-application-form">
      <h2>Apply for Job</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your cover letter here..."
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}

export default JobApplicationForm;
