// src/components/Jobs/JobApplicationList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function JobApplicationList() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/jobs/applications/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const applicationsWithJobTitles = await Promise.all(
          response.data.map(async (application) => {
            // Fetch job details for each application
            const jobResponse = await axios.get(`http://127.0.0.1:8000/api/jobs/${application.job}/`, {
              headers: {
                Authorization: `Token ${token}`,
              },
            });
            return {
              ...application,
              jobTitle: jobResponse.data.title,
            };
          })
        );

        setApplications(applicationsWithJobTitles);
      } catch (error) {
        console.error('Error fetching job applications', error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div>
      <h2>Job Applications</h2>
      <ul>
        {applications.map((application) => (
          <li key={application.id}>
            <Link to={`/care-seeker/applications/${application.id}`}>
              {application.jobTitle} - {application.status}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobApplicationList;
