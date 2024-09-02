import React, { createContext, useState, useEffect } from 'react';
import { post } from '../services/api'; // Import the post method from api.js

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data from local storage or any persistence layer
  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };
    loadUserData();
  }, []);

  // Function to log in the user
  const login = async (email, password) => {
    try {
      const response = await post('/auth/login/', { email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
