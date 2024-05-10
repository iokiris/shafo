import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function withAuthCheck(WrappedComponent) {
  return function(props) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    useEffect(() => {
      const checkAuthentication = async () => {
        try {
          await axios.get('/auth/check_auth');
          setIsAuthenticated(true);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            navigate('/auth');
          }
        }
      };
      
      checkAuthentication();
    }, [navigate]);

    if (!isAuthenticated) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuthCheck;
