import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      {/* Header and Navigation */}
      <header className="home-header">
        <h1>CareAnn</h1>
        <nav>
          <Link to="/services">Services</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/faq">FAQ</Link>
        </nav>
      </header>

      {/* Welcome Section */}
      <section className="welcome-section">
        <h2>Welcome to CareAnn</h2>
        <p>Your trusted platform to connect care seekers with caregivers.</p>
        <div className="home-options">
          <Link to="/login" className="home-option">
            <button>Login</button>
          </Link>
          <Link to="/register" className="home-option">
            <button>Register</button>
          </Link>
        </div>
      </section>

      {/* Service Overview Section */}
      <section className="services-overview">
        <h2>Our Services</h2>
        <div className="services-list">
          <div className="service-item">
            <h3>Respite Care</h3>
            <p>Temporary relief for primary caregivers.</p>
          </div>
          <div className="service-item">
            <h3>Home Care</h3>
            <p>Personal care services provided at home.</p>
          </div>
          <div className="service-item">
            <h3>Senior Care</h3>
            <p>Specialized care for elderly individuals.</p>
          </div>
          {/* Add more services as needed */}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>About CareAnn</h2>
        <p>
          CareAnn is a platform designed to connect individuals seeking care services
          with caregivers offering those services. Whether you need child care, senior
          care, or housekeeping, CareAnn is here to help.
        </p>
      </section>

      {/* Search Bar for Caregivers */}
      <section className="search-section">
        <h2>Find a Caregiver</h2>
        <form className="search-form">
          <input type="text" placeholder="Enter your location" />
          <button type="submit">Search</button>
        </form>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-list">
          <blockquote>
            <p>"CareAnn helped us find the perfect caregiver for my mother."</p>
            <footer>— Sarah J.</footer>
          </blockquote>
          <blockquote>
            <p>"The platform is easy to use and has great support."</p>
            <footer>— John D.</footer>
          </blockquote>
          {/* Add more testimonials as needed */}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        <p>&copy; 2024 CareAnn. All rights reserved.</p>
        <nav>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </footer>
    </div>
  );
}

export default Home;
