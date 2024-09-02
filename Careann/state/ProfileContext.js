import React, { createContext, useState } from 'react';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    location: '',
    bio: '',
    phone: '',
    address: '',
  });

  const saveProfile = (profileData) => {
    setProfile(profileData);
    // Here you would also handle saving the profile data to a backend API
  };

  return (
    <ProfileContext.Provider value={{ profile, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
