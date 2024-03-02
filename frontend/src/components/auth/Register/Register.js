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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/auth/register/', {
        username,
        email,
        password,
      });
      if (response.status === 201) {
        //props.onSuccess();
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
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading} // Делаем недоступным во время загрузки
        />
        <input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading} // Делаем недоступным во время загрузки
        />
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading} // Делаем недоступным во время загрузки
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
