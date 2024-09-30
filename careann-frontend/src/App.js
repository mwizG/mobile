import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './components/Common/theme';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CareSeekerDashboard from './components/Dashboard/CareSeekerDashboard';
import CaregiverDashboard from './components/Dashboard/CaregiverDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Messaging from './components/Messaging/Messaging';
import CaregiverList from './components/Messaging/CaregiverList';
import Caregivers from './pages/Caregivers'
import ConversationList from './components/Messaging/ConversationList';
import JobPostingForm from './components/Forms/JobPostingForm';
import CaregiverJobManagement from './components/Jobs/CaregiverJobManagement'; 
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
import CreateTask from './components/Tasks/CreateTask';
import JobDetail from './components/Jobs/JobDetail';  
import JobUpdate from './components/Jobs/JobUpdate';
import CaregiverJobSearch from './components/Jobs/CaregiverJobSearch';  
import JobApplicationForm from './components/Jobs/JobApplicationForm'; 
import JobApplicationList from './components/Jobs/JobApplicationList';
import JobApplicationUpdate from './components/Jobs/JobApplicationUpdate';
import ProposeJobTime from './components/Jobs/ProposeJobTime';
import AcceptJobTime from './components/Jobs/AcceptJobTime';
import JobApplicationDetails from './components/Jobs/JobApplicationDetails';
import TaskManagement from './components/Tasks/TaskManagement';  
import TaskManagementDetail from './components/Tasks/TaskManagementDetail';  
import JobListingManager from './components/Jobs/JobListingManager';
import CaregiverList2 from './components/Profile/CaregiverList2'; // Adjust the path as necessary
import TicketUpdate from './components/Tickets/TicketUpdate';
import SupportTicket from './components/Tickets/SupportTicket';
import TicketsPage from './components/Tickets/TicketsPage';
import CaregiverDetail from './components/Profile/CareGiverDetail'; 
import CareSeekerDetail from './components/Profile/CareSeekerDetail';
import Review from './components/Reviews/Review';
import ListReviews from './components/Reviews/ListReviews';   
import CaregiverProfile from './components/Profile/CaregiverProfile';
import CareSeekerProfile from './components/Profile/CareSeekerProfile';

function App() {
  const userRole = localStorage.getItem('role');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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

          {/* Route for conversations */}
          <Route path="/conversations/:conversation_id/messages" element={<Messaging />} />
          
          <Route path="/caregivers" element={<Caregivers />} /> 
          <Route path="/support" element={<SupportTicket/>}/>
          <Route path="/Tickets" element={<TicketsPage/>}/>
          <Route path="/ticket-update/:ticketId" element={<TicketUpdate />} />
          {/* Care Seeker-specific routes */}
          <Route path="/care-seeker/dashboard" element={<CareSeekerDashboard />} />
          <Route path="/care-seeker/messaging" element={<Messaging />} />
          <Route path="/care-seeker/post-job" element={<JobPostingForm />} />
          <Route path="/care-seeker/payments" element={<PaymentManagement />} />
          <Route path="/care-seeker/search" element={<SearchCaregiversForm />} />
          <Route path="/care-seeker/rate" element={<RatingReviewForm />} />
          <Route path="care-seeker/jobs/:jobId" element={<JobDetail />} />
          <Route path="care-seeker/jobsUp/:jobId" element={<JobUpdate />}/>
          <Route path="/care-seeker/jobs/:jobId/applications" element={<JobApplicationList />} />
          <Route path="/care-seeker/applications/:pk" element={<JobApplicationUpdate />} />  
          <Route path="/care-seeker/jobs/:id/propose-time" element={<ProposeJobTime />} /> 
          <Route path="/care-seeker/jobs" element={<JobListingManager />} />
          <Route path="/caregiver/:caregiverId" element={<CaregiverDetail />} />
          <Route path="/care-seeker/conversations" element={<ConversationList />} />
          <Route path="/care-seeker/caregiverlist" element={<CaregiverList />} /> 
          <Route path="/care-seeker/listreviews" element={<ListReviews />} /> 
          <Route path="/jobs/:jobId/review-caregiver" element={<Review />} />
          <Route path="/care-seeker/caregiverlist/:serviceType" element={<CaregiverList2 />} />
          <Route path="/care-seeker/profile" element={<CareSeekerProfile/>} />


          {/* Caregiver-specific routes */}
          <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
          <Route path="/caregiver/messaging" element={<Messaging />} />
          <Route path="/caregiver/profile" element={<CaregiverProfile/>} />
          <Route path="/caregiver/search-jobs" element={<CaregiverJobSearch />} />
          <Route path="/caregiver/schedule" element={<CaregiverDashboard />} />
          <Route path="caregiver/jobs/:jobId" element={<JobDetail />} />  
          <Route path="caregiver/jobsUp/:jobId" element={<JobUpdate />}/>
          <Route path="/caregiver/jobs/:jobId/apply" element={<JobApplicationForm />} />
          <Route path="/caregiver/jobs/:id/accept-time" element={<AcceptJobTime />} /> 
          <Route path="/caregiver/applications/:id" element={<JobApplicationDetails />} />
          <Route path="/caregiver-jobs" element={<CaregiverJobManagement />} />
          <Route path="/caregiver/tasks" element={<TaskManagement />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/tasks/:taskId" element={<TaskManagementDetail />} />
          <Route path="/careseeker/:careSeekerId" element={<CareSeekerDetail />} />
          <Route path="/caregiver/conversations" element={<ConversationList />} /> 
          <Route path="/caregiver/listreviews" element={<ListReviews />} /> 
          <Route path="/jobs/:jobId/review-care-seeker" element={<Review />} /> 

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
          <Route path="/tasks" element={<TaskManagement />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
