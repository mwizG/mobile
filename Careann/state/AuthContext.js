import React, { createContext, useState, useEffect } from 'react';
import { post } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [role, setRole] = useState(null); // Add state for role

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = JSON.parse(await AsyncStorage.getItem('user'));
      const storedAccessToken = await AsyncStorage.getItem('accessToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      const storedRole = await AsyncStorage.getItem('role'); // Load the role from AsyncStorage

      if (storedUser) {
        setUser(storedUser);
      }
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
      }
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
      if (storedRole) {
        setRole(storedRole); // Set the role if it exists
      }

      setLoading(false);
    };
    loadUserData();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await post('/accounts/login/', { username, password }); // Ensure the correct endpoint
      const { access, refresh, user, role } = response; // Destructure role from response
      
      // Store data in AsyncStorage
      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('role', role); // Store the role in AsyncStorage
  
      // Update context
      setUser(user);
      setAccessToken(access);
      setRefreshToken(refresh);
      setRole(role); // Update the role in the context
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error; // Re-throw the error to handle it in the component if needed
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('role'); // Remove the role from AsyncStorage
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null); // Reset the role in the context
  };

  // Optional: Implement a function to refresh the access token
  const refreshAccessToken = async () => {
    try {
      const response = await post('/refresh-token/', { refresh: refreshToken });
      const { accessToken: newAccessToken } = response.data;

      await AsyncStorage.setItem('accessToken', newAccessToken);
      setAccessToken(newAccessToken);
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, accessToken, refreshToken, refreshAccessToken, role }}>
      {children}
    </AuthContext.Provider>
  );
};

