import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../state/AuthContext';
import { RoleContext } from '../state/RoleContext';
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

const Stack = createNativeStackNavigator();

const Layout = () => {
  const { user } = useContext(AuthContext) || {}; // Fallback to empty object if undefined
  const { role } = useContext(RoleContext) || {}; // Fallback to empty object if undefined

  // Redirect user based on role
  useEffect(() => {
    if (user) {
      switch (role) {
        case 'admin':
          navigation.navigate('AdminDashboard');
          break;
        case 'care_seeker':
          navigation.navigate('CareSeekerDashboard');
          break;
        case 'caregiver':
          navigation.navigate('CaregiverDashboard');
          break;
        default:
          break;
      }
    }
  }, [user, role]);

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen name="index" component={Home} options={{ title: 'Home' }} />
          <Stack.Screen name="login" component={Login} options={{ title: 'login' }} />
          <Stack.Screen name="Register" component={Register} options={{ title: 'Register' }} />
          <Stack.Screen name="Services" component={Services} options={{ title: 'Services' }} />
          <Stack.Screen name="Contact" component={Contact} options={{ title: 'Contact' }} />
          <Stack.Screen name="FAQ" component={FAQ} options={{ title: 'FAQ' }} />
        </>
      ) : (
        <>
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
        </>
      )}
    </Stack.Navigator>
  );
};

export default Layout;
