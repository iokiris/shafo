import React, { useState } from 'react';

const PasswordInput = ({ value, onChange }) => {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={passwordShown ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="Пароль"
      />
      <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer', position: 'absolute', right: 10, top: 'calc(50% - 10px)', userSelect: 'none' }}>
        {passwordShown ? "👁️" : "👁️‍🗨️"}
      </span>
    </div>
  );
};

export default PasswordInput;
