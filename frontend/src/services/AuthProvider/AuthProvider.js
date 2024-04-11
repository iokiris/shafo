import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await axios.get('/auth/check_auth');
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/auth');
        }
      }
    };

    checkAuthentication();
  }, [navigate]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
