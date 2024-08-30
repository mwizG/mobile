import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CareSeekerDashboard from './pages/CareSeeker';
import CaregiverDashboard from './pages/Caregiver';
import AdminDashboard from './pages/AdminDashboard';
import Messaging from './components/Messaging/Messaging';
import UserManagement from './components/Admin/UserManagement';
import ContentModeration from './components/Admin/ContentModeration';
import PaymentManagement from './components/Forms/PaymentManagement';
import AnalyticsDashboard from './components/Admin/AnalyticsDashboard';
import SupportTickets from './components/Admin/SupportTickets';
import DisputeResolution from './components/Admin/DisputeResolution';
import ModerationAction from './components/Admin/ModerationAction';
import UserActivity from './components/Admin/UserActivity';
import JobPostingForm from './components/Forms/JobPostingForm';
import RatingReviewForm from './components/Forms/RatingReviewForm';
import SearchCaregiversForm from './components/Forms/SearchCaregiversForm';
import CaregiverProfile from './pages/CaregiverProfile';
import CaregiverJobSearch from './pages/CaregiverJobSearch';
import CaregiverSchedule from './pages/CaregiverSchedule';
import JobList from './components/JobList';
import JobDetail from './components/JobDetail';

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
                        ) : userRole === 'admin' ? (
                            <Navigate to="/admin/dashboard" />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />

                {/* Care Seeker-specific routes */}
                <Route path="/care-seeker/dashboard" element={<CareSeekerDashboard />} />
                <Route path="/care-seeker/messaging" element={<Messaging />} />
                <Route path="/care-seeker/post-job" element={<JobPostingForm />} />
                <Route path="/care-seeker/payments" element={<PaymentManagement />} />
                <Route path="/care-seeker/search" element={<SearchCaregiversForm />} />
                <Route path="/care-seeker/rate" element={<RatingReviewForm />} />
                <Route path="/care-seeker/jobs" element={<JobList />} />
                <Route path="/care-seeker/jobs/:id" element={<JobDetail />} />

                {/* Caregiver-specific routes */}
                <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
                <Route path="/caregiver/messaging" element={<Messaging />} />
                <Route path="/caregiver/profile" element={<CaregiverProfile />} />
                <Route path="/caregiver/search-jobs" element={<CaregiverJobSearch />} />
                <Route path="/caregiver/schedule" element={<CaregiverSchedule />} />

                {/* Admin-specific routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/content-moderation" element={<ContentModeration />} />
                <Route path="/admin/payments" element={<PaymentManagement />} />
                <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
                <Route path="/admin/support-tickets" element={<SupportTickets />} />
                <Route path="/admin/disputes" element={<DisputeResolution />} />
                <Route path="/admin/moderation-actions" element={<ModerationAction />} />
                <Route path="/admin/user-activity" element={<UserActivity />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
