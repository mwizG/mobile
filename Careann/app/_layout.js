import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from '../state/AuthContext';
import { RoleProvider, RoleContext } from '../state/RoleContext'; // Import RoleProvider
import Home from './index'; // Landing page
import Login from './login';
import Register from './register';
import AdminDashboard from './dashboard/admin';
import CareSeekerDashboard from './dashboard/care-seeker';
import CaregiverDashboard from './dashboard/caregiver';
import Services from './services';
import Contact from './contact';
import FAQ from './faq';
import ProfileView from '../components/profile/ProfileView';
import ProfileSetupForm from '../components/profile/ProfileSetupForm';
import { ProfileProvider } from '../state/ProfileContext'; 

const Stack = createNativeStackNavigator();

const Layout = () => {
  const { user } = useContext(AuthContext);
  const { role } = useContext(RoleContext);
  
  // Debugging
  console.log("User:", user);
  console.log("Role:", role);

  return (
    <Stack.Navigator>
      {/* Unauthenticated Routes */}
      <Stack.Screen name="index" component={Home} options={{ title: 'Landing Page' }} />
      <Stack.Screen name="login" component={Login} options={{ title: 'Login' }} />
      <Stack.Screen name="register" component={Register} options={{ title: 'Register' }} />
      <Stack.Screen name="services" component={Services} options={{ title: 'Services' }} />
      <Stack.Screen name="contact" component={Contact} options={{ title: 'Contact' }} />
      <Stack.Screen name="FAQ" component={FAQ} options={{ title: 'FAQ' }} />

      {/* Conditionally Render Authenticated Routes Based on User and Role */}
      {user && role === 'admin' && (
        <Stack.Screen name="dashboard/admin" component={AdminDashboard} options={{ title: 'Admin Dashboard' }} />
      )}
      {user && role === 'care_seeker' && (
        <Stack.Screen name="dashboard/care-seeker" component={CareSeekerDashboard} options={{ title: 'Care Seeker Dashboard' }} />
      )}
      {user && role === 'caregiver' && (
        <Stack.Screen name="dashboard/caregiver" component={CaregiverDashboard} options={{ title: 'Caregiver Dashboard' }} />
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


// Wrap the Layout component with both AuthProvider and RoleProvider
export default function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <ProfileProvider> 
          <Layout />
        </ProfileProvider>
      </RoleProvider>
    </AuthProvider>
  );
}
