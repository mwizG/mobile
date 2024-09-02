import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../state/AuthContext';
import { RoleContext } from '../state/RoleContext';
import Login from './login';
import Register from './register';
import AdminDashboard from './dashboard/admin';
import CareSeekerDashboard from './dashboard/care-seeker';
import CaregiverDashboard from './dashboard/caregiver';
import UserManagement from './dashboard/UserManagement';
import PostJob from './dashboard/postJob';
import SearchJobs from './dashboard/SearchJobs';
import ProfileView from '../components/profile/ProfileView';
import ProfileSetupForm from '../components/profile/ProfileSetupForm';
import Home from './index';
import { JobProvider } from '../state/JobContext';  // Corrected import path for JobProvider

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const { user } = useContext(AuthContext);
  const { role } = useContext(RoleContext);

  const renderDashboard = () => {
    if (role === 'admin') {
      return (
        <>
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="UserManagement" component={UserManagement} />
          <Stack.Screen name="ProfileView" component={ProfileView} />
          <Stack.Screen name="ProfileSetupForm" component={ProfileSetupForm} />
        </>
      );
    } else if (role === 'care_seeker') {
      return (
        <>
          <Stack.Screen name="CareSeekerDashboard" component={CareSeekerDashboard} />
          <Stack.Screen name="PostJob" component={PostJob} />
          <Stack.Screen name="ProfileView" component={ProfileView} />
          <Stack.Screen name="ProfileSetupForm" component={ProfileSetupForm} />
        </>
      );
    } else if (role === 'caregiver') {
      return (
        <>
          <Stack.Screen name="CaregiverDashboard" component={CaregiverDashboard} />
          <Stack.Screen name="SearchJobs" component={SearchJobs} />
          <Stack.Screen name="ProfileView" component={ProfileView} />
          <Stack.Screen name="ProfileSetupForm" component={ProfileSetupForm} />
        </>
      );
    }
  };

  return (
    <JobProvider>  {/* Wrap the entire navigator with JobProvider */}
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : (
          renderDashboard()
        )}
      </Stack.Navigator>
    </JobProvider>
  );
};

export default MainNavigator;
