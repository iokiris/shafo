import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function withAuthCheck(WrappedComponent) {
  return function(props) {
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuthentication = async () => {
        try {
          await axios.get('/auth/check_auth');
        } catch (error) {
          if (error.response && error.response.status === 401) {
            navigate('/auth');
          }
        }
      };
      
      checkAuthentication();
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
}

export default withAuthCheck;