import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CareSeekerDashboard from './components/CareSeekerDashboard';
import ServiceSearch from './components/ServiceSearch';
import JobPosting from './components/JobPosting';
import CaregiverReviews from './components/CaregiverReviews';
import CaregiverDashboard from './components/CaregiverDashboard';
import CaregiverProfile from './components/CaregiverProfile';
import CaregiverJobSearch from './components/CaregiverJobSearch';
import CaregiverSchedule from './components/CaregiverSchedule';
import Messaging from './components/Messaging';  // Importing the Messaging component

function AppRoutes() {
  const userRole = localStorage.getItem('role'); // Assuming you store the role in localStorage after login

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirect users based on role */}
        <Route
          path="/dashboard"
          element={
            userRole === 'care_seeker' ? (
              <Navigate to="/care-seeker/dashboard" />
            ) : userRole === 'caregiver' ? (
              <Navigate to="/caregiver/dashboard" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Care Seeker-specific routes */}
        <Route path="/care-seeker/dashboard" element={<CareSeekerDashboard />} />
        <Route path="/care-seeker/search" element={<ServiceSearch />} />
        <Route path="/care-seeker/post-job" element={<JobPosting />} />
        <Route path="/care-seeker/reviews" element={<CaregiverReviews />} />

        {/* Caregiver-specific routes */}
        <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
        <Route
          path="/caregiver/profile"
          element={userRole === 'caregiver' ? <CaregiverProfile /> : <Navigate to="/" />}
        />
        <Route
          path="/caregiver/search-jobs"
          element={userRole === 'caregiver' ? <CaregiverJobSearch /> : <Navigate to="/" />}
        />
        <Route
          path="/caregiver/schedule"
          element={userRole === 'caregiver' ? <CaregiverSchedule /> : <Navigate to="/" />}
        />

        {/* Messaging route, accessible to both roles */}
        <Route
          path="/messaging"
          element={userRole ? <Messaging /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
