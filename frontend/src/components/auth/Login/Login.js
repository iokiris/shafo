import React, { useState } from 'react';
import axios from 'axios';
import PasswordInput from '../PasswordInput';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const[error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('auth/login/', {
        username,
        password,
      });
      if (response.status === 200) {
        props.onSuccess();
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setError('Неверно введены данные');
        }
        if (status === 429) {
          setError('Повторите попытку позже.')
        }
      }
      else setError('Не удалось войти в аккаунт')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className='logo'>SHAFO</h2>
        <label className='error-label'>{error}</label>
        <input
          type="text"
          placeholder="Email или имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '⏳' : 'Войти'}
        </button>
        <div className="additional-links">
          <a href="?act=register">Регистрация</a>
          <a href="/forgot-password">Забыли пароль?</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
