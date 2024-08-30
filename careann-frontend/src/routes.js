// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CareSeekerDashboard from './pages/CareSeekerDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';
import Messaging from './components/Messaging/Messaging';
import JobPosting from './components/JobPosting';
import SearchCaregiversForm from './components/Forms/SearchCaregiversForm';
import Notifications from './components/Notifications';
import CaregiverProfile from './components/CaregiverProfile';
import CaregiverCalendar from './components/Schedule/Calendar';

function AppRoutes() {
    const userRole = localStorage.getItem('role');

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
                <Route path="/care-seeker/messaging" element={<Messaging />} />
                <Route path="/care-seeker/post-job" element={<JobPosting />} />
                <Route path="/care-seeker/search-caregivers" element={<SearchCaregiversForm />} />
                <Route path="/care-seeker/notifications" element={<Notifications />} />

                {/* Caregiver-specific routes */}
                <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
                <Route path="/caregiver/messaging" element={<Messaging />} />
                <Route path="/caregiver/profile" element={<CaregiverProfile />} />
                <Route path="/caregiver/calendar" element={<CaregiverCalendar />} />
                <Route path="/caregiver/notifications" element={<Notifications />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
