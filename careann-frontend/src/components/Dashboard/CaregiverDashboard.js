import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CaregiverDashboard() {
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
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching job applications', error);
            }
        };

        fetchApplications();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Caregiver Dashboard</h1>
            <p>Welcome to your dashboard. From here, you can manage all aspects of your caregiving services effectively.</p>

            <div className="dashboard-options">
                <Link to="/caregiver/search-jobs">
                    <button>Search for Jobs</button>
                </Link>
            
                <Link to="/caregiver-jobs">
                    <button>View & Manage Jobs</button>
                </Link>
                <Link to="/caregiver/schedule">
                    <button>Manage Schedule & Availability</button>
                </Link>
                <Link to="/caregiver/tasks">
                    <button>Task Management</button>
                </Link>
                <Link to="/caregiver/history">
                    <button>Job History</button>
                </Link>
                <Link to="/caregiver/conversations">
                    <button>Conversations</button>
                </Link>
                <Link to="/caregiver/reviews">
                    <button>View & Manage Reviews</button>
                </Link>
                <Link to="/caregiver/payments">
                    <button>Manage Payments</button>
                </Link>
                <Link to="/caregiver/analytics">
                    <button>View Analytics</button>
                </Link>
                <Link to="/caregiver/resources">
                    <button>Learning & Resources</button>
                </Link>
                <Link to="/caregiver/feedback">
                    <button>Client Feedback</button>
                </Link>
                <Link to="/caregiver/emergency-contacts">
                    <button>Emergency Contacts</button>
                </Link>
                <Link to="/caregiver/support">
                    <button>Support & Help</button>
                </Link>
                <Link to="/caregiver/subscriptions">
                    <button>Manage Subscriptions</button>
                </Link>
                <Link to="/caregiver/settings">
                    <button>Settings</button>
                </Link>
            </div>

            <div className="applications-section">
            <h3>Job Applications</h3>
                <ul>
                    {applications.map((application) => (
                        <li key={application.id}>
                            <Link to={`/caregiver/applications/${application.job}`}>
                                <strong>{application.job}</strong>
                            </Link>
                            <span> - Status: {application.status}</span>
                            {application.status === 'Accepted' && application.job.proposed_time && (
                                <p>Proposed Time: {new Date(application.job.proposed_time).toLocaleString()}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CaregiverDashboard;
