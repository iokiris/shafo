import React, { useState } from 'react';
import axios from 'axios';
import PasswordInput from '../PasswordInput';
const Register = (props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Валидация данных формы перед отправкой
    try {
      // Замените URL на актуальный путь к вашему API регистрации
      const response = await axios.post('/auth/register/', {
        username,
        email,
        password,
      });
      if (response.status === 200) {
        props.onSuccess();
      }
      console.log(response.data);
      // Обработайте успешную регистрацию здесь, например, перенаправление на страницу входа
    } catch (error) {
      console.error(error);
      // Обработайте ошибку регистрации здесь
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="logo">SHAFO</div>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Зарегистрироваться</button>
        <div className="additional-links">
          <a href="?act=login">У меня есть аккаунт</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
