import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CareSeekerDashboard from './components/CareSeekerDashboard';
import CaregiverDashboard from './components/CaregiverDashboard';
import CaregiverProfile from './components/CaregiverProfile';
import CaregiverJobSearch from './components/CaregiverJobSearch';
import CaregiverSchedule from './components/CaregiverSchedule';
import Messaging from './components/Messaging';
import JobList from './components/JobList';  // Import JobList component

function AppRoutes() {
  const userRole = localStorage.getItem('role'); // Retrieve the stored role

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Caregiver-specific routes */}
        <Route
          path="/caregiver/dashboard"
          element={userRole === 'caregiver' ? <CaregiverDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/caregiver/profile"
          element={userRole === 'caregiver' ? <CaregiverProfile /> : <Navigate to="/" />}
        />
        <Route
          path="/caregiver/search-jobs"
          element={userRole === 'caregiver' ? <CaregiverJobSearch /> : <Navigate to="/" />}
        />
        <Route
          path="/caregiver/jobs"
          element={userRole === 'caregiver' ? <JobList /> : <Navigate to="/" />}  // Corrected route for JobList
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

        {/* Care Seeker-specific routes */}
        <Route path="/care-seeker/dashboard" element={<CareSeekerDashboard />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
