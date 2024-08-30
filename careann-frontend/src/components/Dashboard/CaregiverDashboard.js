// src/components/Dashboard/CaregiverDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

function CaregiverDashboard() {
    return (
        <div className="dashboard-container">
            <h1>Caregiver Dashboard</h1>
            <p>Welcome to your dashboard. From here, you can manage all aspects of your caregiving services effectively.</p>

            <div className="dashboard-options">
                <Link to="/caregiver/search-jobs">
                    <button>Search for Jobs</button>
                </Link>
                <Link to="/caregiver/search-jobs">
                    <button>View Available Jobs</button>
                </Link>
                <Link to="/caregiver/applications">
                    <button>View & Manage Applications</button>
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
                <Link to="/caregiver/messaging">
                    <button>Messaging</button>
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

            <div className="notifications-section">
                <h3>Notifications</h3>
                <ul>
                    {/* Example notifications, replace with actual data */}
                    <li>You have 2 new job applications to review.</li>
                    <li>Your schedule has been updated for the week.</li>
                </ul>
            </div>
        </div>
    );
}

export default CaregiverDashboard;
