import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/'); // Navigate to home page after logout
  };

  return (
    <div className="home-container">
      <h1>Welcome to CareAnn</h1>
      <p>Your trusted platform to connect care seekers with caregivers.</p>

      <div className="home-options">
        {token ? (
          <>
            {role === 'care_seeker' && (
              <div className="care-seeker-options">
                <Link to="/care-seeker/dashboard" className="home-option">
                  <button>Care Seeker Dashboard</button>
                </Link>
                <Link to="/care-seeker/post-job" className="home-option">
                  <button>Post a Job</button>
                </Link>
                <Link to="/care-seeker/search" className="home-option">
                  <button>Search Caregivers</button>
                </Link>
                <Link to="/care-seeker/reviews" className="home-option">
                  <button>Manage Reviews</button>
                </Link>
              </div>
            )}
            {role === 'caregiver' && (
              <div className="caregiver-options">
                <Link to="/caregiver/dashboard" className="home-option">
                  <button>Caregiver Dashboard</button>
                </Link>
                <Link to="/caregiver/search-jobs" className="home-option">
                  <button>Search Job Listings</button>
                </Link>
                <Link to="/caregiver/schedule" className="home-option">
                  <button>Manage Schedule</button>
                </Link>
                <Link to="/caregiver/reviews" className="home-option">
                  <button>View Reviews</button>
                </Link>
              </div>
            )}
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <div className="auth-options">
            <Link to="/login" className="home-option">
              <button>Login</button>
            </Link>
            <Link to="/register" className="home-option">
              <button>Register</button>
            </Link>
          </div>
        )}
      </div>

      <div className="about-section">
        <h2>About CareAnn</h2>
        <p>
          CareAnn is a platform designed to connect individuals seeking care services
          with caregivers offering those services. Whether you need child care, senior
          care, or housekeeping, CareAnn is here to help.
        </p>
      </div>
    </div>
  );
}

export default Home;
