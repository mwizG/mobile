import React, { createContext, useState, useEffect } from 'react';
import { post } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = JSON.parse(await AsyncStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };
    loadUserData();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await post('/login/', { username, password });
      const { token, user } = response.data;
      
      // Store data in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Update context
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
