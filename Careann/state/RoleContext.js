import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user && user.role) {
      setRole(user.role); // Assuming the user object contains a 'role' property
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
