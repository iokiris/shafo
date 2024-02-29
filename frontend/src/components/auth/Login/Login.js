import React, { useState } from 'react';
import axios from 'axios';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('auth/login/', {
        username,
        password,
      });
      if (response.status === 200) {
        props.onSuccess();
      }
      console.log(response.data);
      // Обработайте успешный вход здесь
    } catch (error) {
      console.error(error);
      // Обработайте ошибку логина здесь
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className='logo'>SHAFO</h2>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Войти</button>
        <div className="additional-links">
          <a href="?act=register">Регистрация</a>
          <a href="/forgot-password">Забыли пароль?</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
