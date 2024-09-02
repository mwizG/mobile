import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './state/AuthContext';
import { RoleProvider } from './state/RoleContext';
import { JobProvider } from './state/JobContext';  // Import JobProvider
import MainNavigator from './app/MainNavigator';

export default function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <JobProvider>  {/* Wrap the MainNavigator with JobProvider */}
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </JobProvider>
      </RoleProvider>
    </AuthProvider>
  );
}
