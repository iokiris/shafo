import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './IndexPage.css';
import axios from 'axios';
import LaunchSVG from '../../media/svg/Index/LaunchSVG'; // Убедитесь, что путь верный

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
        <a className="user-action" onClick={handleUserAction}>
          {username ? `${username}` : 'Войдите в аккаунт'}
        </a>
      </header>
      <div className="main-content">
        <div className="left-section">
          <LaunchSVG />
        </div>
        <div className="right-section">
          <p style={{fontSize: '2em'}}>Добро пожаловать в <span style={{fontWeight: 'bold'}}>SHAFO.</span></p>
          <ul className="services-list">
            <span>Наши сервисы:</span>
            <li className="service-item"><a href="/ai/analyze-face" className="service-link">Анализ лица</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
