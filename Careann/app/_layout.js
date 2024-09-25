import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from '../state/AuthContext';
import { RoleProvider, RoleContext } from '../state/RoleContext'; // Import RoleProvider
import Home from './index'; // Landing page
import Login from './login';
import Register from './register';
import AdminDashboard from './dashboard/admin';
import CareSeekerDashboard from './dashboard/careseekerDashboard';
import CaregiverDashboard from './dashboard/caregiverDashboard';
import Services from './services';
import Contact from './contact';
import FAQ from './faq';
import ProfileView from '../components/profile/ProfileView';
import JobList from '../components/job/JobList';
import SearchJobs from '../components/job/SearchJobs';
import ProfileSetupForm from '../components/profile/ProfileSetupForm';
import { ProfileProvider } from '../state/ProfileContext'; 
import { JobProvider } from '../state/JobContext'; 
import { NavigationContainer } from '@react-navigation/native';
import JobDetails from '../components/job/JobDetails';
import JobPostingForm from '../components/job/JobPostingForm';
import JobListingManager from '../components/job/JobListingManager';
import JobApplicationList from '../components/job/JobApplicationList';
import JobApplicationDetail from '../components/job/JobApplicationDetails';
import JobApplicationUpdate from '../components/job/JobApplicationUpdate';
import JobApplicationForm from '../components/job/JobApplicationForm';
import CGDashboard from './dashboard/newcgdash';

const Stack = createNativeStackNavigator();

const Layout = () => {
  const { user } = useContext(AuthContext);
  const { role } = useContext(RoleContext);
  
  // Debugging
  //console.log("User:", user);
  //console.log("Role:", role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Unauthenticated Routes JobApplicationUpdate*/}
      <Stack.Screen name="index" component={Home} options={{ title: 'Landing Page' }} />
      <Stack.Screen name="login" component={Login} options={{ title: 'Login' }} />
      <Stack.Screen name="register" component={Register} options={{ title: 'Register' }} />
      <Stack.Screen name="services" component={Services} options={{ title: 'Services' }} />
      <Stack.Screen name="contact" component={Contact} options={{ title: 'Contact' }} />
      <Stack.Screen name="JobList" component={JobList} options={{ title: 'job list',headerShown: true  }} />
      <Stack.Screen name="JobListingManager" component={JobListingManager} options={{ title: 'job listing',headerShown: true  }} />
      <Stack.Screen name="JobApplicationList" component={JobApplicationList} options={{ title: 'Application list' }} />
      <Stack.Screen name="JobPostingForm" component={JobPostingForm} options={{ title: 'Post job',headerShown: true }} />
      <Stack.Screen name="SearchJobs" component={SearchJobs} options={{ title: 'search jobs' }} />
      <Stack.Screen name="JobDetails" component={JobDetails} options={{ title: 'job details' }}/>
      <Stack.Screen name="JobApplicationDetail" component={JobApplicationDetail} options={{ title: 'application details' }}/>
      <Stack.Screen name="JobApplicationUpdate" component={JobApplicationUpdate} options={{ title: 'application update' }}/>
      <Stack.Screen name="JobApplicationForm" component={JobApplicationForm} options={{ title: 'application form' }}/>
      <Stack.Screen name="FAQ" component={FAQ} options={{ title: 'FAQ' }} />

      {/* Conditionally Render Authenticated Routes Based on User and Role */}
      {user && role === 'admin' && (
        <Stack.Screen name="dashboard/admin" component={AdminDashboard} options={{ title: 'Admin Dashboard',headerBackVisible: false }} />
      )}
      {user && role === 'care_seeker' && (
        <Stack.Screen name="dashboard/careseeker" component={CareSeekerDashboard} options={{ title: 'Care Seeker Dashboard',headerBackVisible: false }} />
      )}
      {user && role === 'caregiver' && (
        <Stack.Screen name="dashboard/caregiver" component={CGDashboard} options={{ title: 'Caregiver Dashboard',headerBackVisible: false }} />
      )}

      {/* Profile and Other Authenticated Routes */}
      {user && (
        <>
          <Stack.Screen name="ProfileView" component={ProfileView} options={{ title: 'View Profile' }} />
          <Stack.Screen name="ProfileSetupForm" component={ProfileSetupForm} options={{ title: 'Set Up Profile' }} />
        </>
      )}
    </Stack.Navigator>
  );
};




export default function App() {
  return (
    <NavigationContainer independent={true}>
      <AuthProvider>
        <RoleProvider>
          <ProfileProvider>
            <JobProvider>
              <Layout />
            </JobProvider>
          </ProfileProvider>
        </RoleProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
