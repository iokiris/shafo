import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './IndexPage.css';
import axios from 'axios';

export default function IndexPage() {
  const [username, setUsername] = useState('');
  let navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/check_auth');
        setUsername(response.data.username);
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
      }
    };

    checkAuth();
  }, []);

  const handleUserAction = () => {
    if (username) {
      navigate('/account');
    } else {
      navigate('/auth?act=login');
    }
  };

  return (
    <div className="index-page">
      <header>
        <h1>SHAFO</h1>
        <div className="user-action" onClick={handleUserAction}>
          {username ? `${username}` : 'Войдите в аккаунт'}
        </div>
      </header>
      <main>
        <section className="welcome-text">
          <p>Welcome to SHAFO</p>
        </section>
        <section className="feature-svg">
        </section>
      </main>
    </div>
  );
};

