import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to CareAnn</h1>
      <p>Your trusted platform to connect care seekers with caregivers.</p>
      <div className="home-options">
        <Link to="/login" className="home-option">
          <button>Login</button>
        </Link>
        <Link to="/register" className="home-option">
          <button>Register</button>
        </Link>
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
