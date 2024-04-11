import React, { useState } from 'react';
import axios from 'axios';
import PasswordInput from '../PasswordInput';
import EmailSvgIcon from '../../../media/svg/Email/EmailSvgIcon';

const Register = (props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });
  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: '', email: '', password: '' };
    
    if (!username) {
      newErrors.username = 'Имя пользователя не может быть пустым';
      isValid = false;
    } else if (username.length < 4) {
      newErrors.username = 'Имя пользователя должно быть длиннее 3 символов';
      isValid = false;
    }
  
    if (!email) {
      newErrors.email = 'Электронная почта не может быть пустой';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Некорректный формат электронной почты';
      isValid = false;
    }
  
    if (!password) {
      newErrors.password = 'Пароль не может быть пустым';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен быть длиннее 5 символов';
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/auth/register/', {
        username,
        email,
        password,
      });
      if (response.status === 201) {
        setEmailSent(true);
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="login-container">
        <div className="confirmation-message">
          <EmailSvgIcon />
          Письмо с подтверждением было отправлено на вашу почту.<br></br>Следуйте инструкциям для активации аккаунта.
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="logo">SHAFO</div>
        <input className={`${errors.username ? 'invalid-inp':''}`}
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading} 
        />
        <input className={`${errors.email ? 'invalid-inp':''}`}
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading} 
        />
        <PasswordInput className={`${errors.password ? 'invalid-inp':''}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading || emailSent}>
          {isLoading ? '⏳' : 'Зарегистрироваться'}
        </button>
        <div className="additional-links">
          <a href="?act=login">У меня есть аккаунт</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
