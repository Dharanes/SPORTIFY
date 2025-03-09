import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(null);
    const roleFromRedux = useSelector((state) => state.auth.role)

  useEffect(() => {
    if(roleFromRedux){
        setRole(roleFromRedux)
    }
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

// Custom hook to access the role
export function useRole() {
  return useContext(RoleContext);
}
