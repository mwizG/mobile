import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function JobApplicationUpdate() {
  const { pk } = useParams(); // Get the application ID from the URL
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null); // State for the job
  const [status, setStatus] = useState('');
  const [proposeNewTime, setProposeNewTime] = useState(false); // Toggle for time proposal
  const [newProposedTime, setNewProposedTime] = useState(''); // New proposed time
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(''); // State for the user's role

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role'); // Fetch the user role
        setUserRole(role);

        // Fetch the application details
        const appResponse = await axios.get(`http://127.0.0.1:8000/api/jobs/applications/${pk}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setApplication(appResponse.data);
        setStatus(appResponse.data.status); // Set application status
        
        // Fetch the job details
        const jobResponse = await axios.get(`http://127.0.0.1:8000/api/jobs/${appResponse.data.job}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setJob(jobResponse.data);
      } catch (error) {
        console.error('Error fetching application or job details', error);
        setError('Error fetching application or job details.');
      }
    };

    fetchApplication();
  }, [pk]);

  const handleStatusUpdate = async (newStatus) => {
    setStatus(newStatus);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:8000/api/jobs/applications/${pk}/`, { status: newStatus }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log(`Job application status updated to: ${newStatus}`);
    } catch (error) {
      console.error('Error updating job application', error);
      setError('Error updating job application.');
    }
  };

  const handleProposeTimeUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const proposedTime = proposeNewTime ? newProposedTime : job.proposed_time;
      
      await axios.patch(`http://127.0.0.1:8000/api/jobs/${application.job}/propose-time/`, { proposed_time: proposedTime }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert("Job time updated successfully!");
    } catch (error) {
      console.error('Error updating proposed time', error);
      setError('Error updating proposed time.');
    }
  };

  // Define handleAcceptJobTime function (for caregivers only)
  const handleAcceptJobTime = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:8000/api/jobs/${job.id}/accept-time/`, {}, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert("Job time accepted successfully!");
    } catch (error) {
      console.error('Error accepting the job time', error);
      setError('Error accepting the job time.');
    }
  };

  // Define handleDeclineJob function (for caregivers only)
  const handleDeclineJob = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:8000/api/jobs/${job.id}/decline/`, {}, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert("Job declined successfully!");
    } catch (error) {
      console.error('Error declining the job', error);
      setError('Error declining the job.');
    }
  };

  // Handle navigation to caregiver's profile
  const goToCaregiverProfile = () => {
    navigate(`/caregiver/${application.caregiver_id}`); // Navigate to caregiver profile using the correct route
  };

  if (!application || !job) {
    return <div>Loading application or job details...</div>;
  }

  return (
    <div>
      <h2>Update Job Application</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p><strong>Job:</strong> {job.title}</p>

      <p>
        <strong>Caregiver:</strong>{' '}
        <span
          className="caregiver-link"
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={goToCaregiverProfile}  // Navigate to caregiver's profile
        >
          {application.caregiver}
        </span>
      </p>

      <p><strong>Cover Letter:</strong> {application.cover_letter}</p>
      <p><strong>Applied At:</strong> {new Date(application.applied_at).toLocaleDateString()}</p>

      {/* Status dropdown automatically updates the status */}
      <p>
        <strong>Status:</strong>
        <select value={status} onChange={(e) => handleStatusUpdate(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </p>

      {/* Propose or update job time if the status is accepted */}
      {status === 'Accepted' && (
        <>
          <h3>Propose Job Time</h3>
          <p><strong>Current Proposed Time:</strong> {new Date(job.proposed_time).toLocaleString()}</p>
          
          {/* Toggle for updating the time or keeping the old one */}
          <label>
            <input
              type="checkbox"
              checked={proposeNewTime}
              onChange={(e) => setProposeNewTime(e.target.checked)}
            />
            Propose a new time
          </label>

          {/* Show input for new time only if the user wants to propose a new time */}
          {proposeNewTime && (
            <input
              type="datetime-local"
              value={newProposedTime}
              onChange={(e) => setNewProposedTime(e.target.value)}
            />
          )}

          {/* Update time button */}
          <button onClick={handleProposeTimeUpdate}>
            {proposeNewTime ? "Propose New Time" : "Keep Current Time"}
          </button>

          {/* Only show Accept/Decline buttons for caregivers */}
          {userRole === 'caregiver' && (
            <>
              <button onClick={handleAcceptJobTime}>Accept Job Time</button>
              <button onClick={handleDeclineJob}>Decline Job</button>
            </>
          )}
        </>
      )}

      {/* Back button to navigate to the previous page */}
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

export default JobApplicationUpdate;
