import React from 'react';
import { Link } from 'react-router-dom';

function CareSeekerDashboard() {
  return (
    <div className="dashboard-container">
      <h1>Care Seeker Dashboard</h1>
      <p>Welcome to your dashboard. From here, you can manage your care needs effectively.</p>

      <div className="dashboard-options">
        <Link to="/care-seeker/search">
          <button>Search for Caregivers</button>
        </Link>
        <Link to="/care-seeker/post-job">
          <button>Post a Job</button>
        </Link>
        
        <Link to="/care-seeker/jobs">
          <button>View & Manage Job Listings</button>
        </Link>
        <Link to="/care-seeker/caregiverlist">
          <button>Caregivers</button>
        </Link>
        <Link to="/care-seeker/conversations">
                    <button>Conversations</button>
         </Link>
        <Link to="/care-seeker/payments">
          <button>Manage Payments</button>
        </Link>
        <Link to="/caregiver/listreviews">
          <button>Manage Reviews</button>
        </Link>
        <Link to="/care-seeker/schedule">
          <button>Manage Schedule</button>
        </Link>
        <Link to="/care-seeker/emergency-services">
          <button>Emergency Services</button>
        </Link>
        <Link to="/care-seeker/profile">
          <button>Profile Management</button>
        </Link>
        <Link to="/care-seeker/settings">
          <button>Settings</button>
        </Link>
      </div>

      <div className="notifications-section">
        <h3>Notifications</h3>
        <ul>
          {/* Example notifications, replace with actual data */}
          <li>You have 3 new messages from caregivers.</li>
          <li>Your job posting "Elderly Care Needed" received 5 applications.</li>
        </ul>
      </div>

    </div>
  );
}

export default CareSeekerDashboard;
