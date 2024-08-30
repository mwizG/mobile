import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/Login';
import Register from './pages/Register';
import CareSeekerDashboard from './components/Dashboard/CareSeekerDashboard';
import CaregiverDashboard from './components/Dashboard/CaregiverDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Messaging from './components/Messaging/Messaging';
import JobPostingForm from './components/Forms/JobPostingForm';
import PaymentManagement from './components/Forms/PaymentManagement';
import SearchCaregiversForm from './components/Forms/SearchCaregiversForm';
import RatingReviewForm from './components/Forms/RatingReviewForm';
import UserManagement from './components/Admin/UserManagement';
import ContentModeration from './components/Admin/ContentModeration';
import AnalyticsDashboard from './components/Admin/AnalyticsDashboard';
import SupportTickets from './components/Admin/SupportTickets';
import DisputeResolution from './components/Admin/DisputeResolution';
import ModerationAction from './components/Admin/ModerationAction';
import UserActivity from './components/Admin/UserActivity';
import JobList from './components/Jobs/JobList';
import JobDetail from './components/Jobs/JobDetail';  // Import JobDetail
import CaregiverJobSearch from './components/Jobs/CaregiverJobSearch';  // Import CaregiverJobSearch

function App() {
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
        <Route path="care-seeker/jobs/:jobId" element={<JobDetail />} />  {/* JobDetail Route */}

        {/* Caregiver-specific routes */}
        <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
        <Route path="/caregiver/messaging" element={<Messaging />} />
        <Route path="/caregiver/profile" element={<CaregiverDashboard />} />
        <Route path="/caregiver/search-jobs" element={<CaregiverJobSearch />} />
        <Route path="/caregiver/schedule" element={<CaregiverDashboard />} />
        <Route path="caregiver/jobs/:jobId" element={<JobDetail />} />  {/* JobDetail Route */}
        

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

export default App;
