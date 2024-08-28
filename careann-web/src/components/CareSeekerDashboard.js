// src/components/CareSeekerDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

function CareSeekerDashboard() {
  return (
    <div className="dashboard-container">
      <h1>Care Seeker Dashboard</h1>
      <p>Welcome to your dashboard. From here, you can search for caregivers, post job listings, and manage your reviews.</p>

      <div className="dashboard-options">
        <Link to="/care-seeker/search">
          <button>Search for Caregivers</button>
        </Link>
        <Link to="/care-seeker/post-job">
          <button>Post a Job</button>
        </Link>
        <Link to="/care-seeker/reviews">
          <button>Manage Reviews</button>
        </Link>
      </div>
    </div>
  );
}

export default CareSeekerDashboard;
