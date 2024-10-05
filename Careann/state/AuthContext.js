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

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = JSON.parse(await AsyncStorage.getItem('user'));
      const storedAccessToken = await AsyncStorage.getItem('accessToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

      if (storedUser) {
        setUser(storedUser);
      }
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
      }
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
      
      setLoading(false);
    };
    loadUserData();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await post('/login/', { username, password });
      const { accessToken, refreshToken, user } = response.data;
      
      // Store data in AsyncStorage
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Update context
      setUser(user);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
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
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, accessToken, refreshToken, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
