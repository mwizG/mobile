import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // Access user from AuthContext
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user) {
      // Determine the role based on the user object
      if (user.is_caregiver) {
        setRole('caregiver');
      } else if (user.is_care_seeker) {
        setRole('care_seeker');
      } else if (user.is_admin) {
        setRole('admin');
      } else {
        setRole('unknown'); // Default to unknown if no valid role is found
      }
    } else {
      setRole(null);
    }
  }, [user]);

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
};
