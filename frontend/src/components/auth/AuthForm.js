import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css'
import Login from './Login/Login';
import Register from './Register/Register';

const AuthForm = (props) => {
  let [searchParams] = useSearchParams();
  let navigate = useNavigate();
  let act = searchParams.get('act') || 'login';
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await axios.get('/auth/check_auth');
        if (response.status === 200) {
          navigate('/');
        }
      } catch (error) {
        console.log('Не авторизован, оставляем на странице входа/регистрации');
      }
    };

    checkAuthorization();
  }, [navigate, authChecked]);

  const onAuthSuccess = () => {
    setAuthChecked(prev => !prev);
  };

  return (
    <div>
      {act === 'login' && <Login onSuccess={onAuthSuccess} />}
      {act === 'register' && <Register onSuccess={onAuthSuccess} />}
    </div>
  );
};

export default AuthForm;
