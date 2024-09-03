import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from '../state/AuthContext';
import { RoleProvider, RoleContext } from '../state/RoleContext'; // Import RoleProvider
import Home from './index';
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

  if (!user) {
    // No user is signed in, show the login-related screens
    return (
      <Stack.Navigator>
        <Stack.Screen name="login" component={Login} options={{ title: 'login' }} />
        <Stack.Screen name="index" component={Home} options={{ title: 'index' }} />
        <Stack.Screen name="register" component={Register} options={{ title: 'register' }} />
        <Stack.Screen name="services" component={Services} options={{ title: 'services' }} />
        <Stack.Screen name="contact" component={Contact} options={{ title: 'Contact' }} />
        <Stack.Screen name="FAQ" component={FAQ} options={{ title: 'FAQ' }} />
      </Stack.Navigator>
    );
  }

  // User is signed in, render the dashboard based on the role
  return (
    <Stack.Navigator>
      {role === 'admin' && (
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Dashboard' }} />
      )}
      {role === 'care_seeker' && (
        <Stack.Screen name="CareSeekerDashboard" component={CareSeekerDashboard} options={{ title: 'Care Seeker Dashboard' }} />
      )}
      {role === 'caregiver' && (
        <Stack.Screen name="CaregiverDashboard" component={CaregiverDashboard} options={{ title: 'Caregiver Dashboard' }} />
      )}
      <Stack.Screen name="ProfileView" component={ProfileView} options={{ title: 'View Profile' }} />
      <Stack.Screen name="ProfileSetupForm" component={ProfileSetupForm} options={{ title: 'Set Up Profile' }} />
    </Stack.Navigator>
  );
};

// Wrap the Layout component with both AuthProvider and RoleProvider
export default function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <ProfileProvider> {/* Wrap Layout with ProfileProvider */}
          <Layout />
        </ProfileProvider>
      </RoleProvider>
    </AuthProvider>
  );
}
