import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './state/AuthContext';
import { RoleProvider } from './state/RoleContext';
import Layout from './app/Layout';

export default function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <NavigationContainer>
          <Layout />
        </NavigationContainer>
      </RoleProvider>
    </AuthProvider>
  );
}
