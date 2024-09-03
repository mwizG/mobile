import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    location: '',
    bio: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      // Assuming you load profile from AsyncStorage or an API
      const storedProfile = JSON.parse(await AsyncStorage.getItem('profile'));
      if (storedProfile) {
        setProfile(storedProfile);
      }
    };
    loadProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
