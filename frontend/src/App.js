import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie'; // Импортируем js-cookie
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [newUser, setNewUser] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputError, setInputError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Загрузка имени пользователя из куки при инициализации
    useEffect(() => {
      const savedUsername = Cookies.get('username'); // Получаем имя пользователя из куки
      if (savedUsername) {
        fetch(`/chat/check_user?username=${encodeURIComponent(savedUsername)}`)
        .then(response => response.json())
        .then(data => {
            if (data.user_exists) {
                console.log("Пользователь существует.");
                setUsername(savedUsername);
            } else {
                console.log("Пользователь не найден.");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
      } 

      fetch('/chat/get_messages/')
        .then(response => response.json())
        .then(data => setMessages(data));
    }, []);

  // Пуллинг сообщений
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/chat/get_messages/')
        .then(response => response.json())
        .then(data => setMessages(data));
    }, 1000);
    return () => clearInterval(interval);
  });
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Прокрутка при инициализации и обновлении сообщений
  }, [messages]);

  // Добавление нового пользователя и сохранение его в куки
  const addUser = () => {
    fetch('/chat/create_user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: newUser }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        throw new Error("Имя занято");
      } else {
        throw new Error("Произошла ошибка");
      }
    })
    .then(data => {
      setUsername(data.username);
      Cookies.set('username', data.username, { expires: 7 }); // Сохраняем имя пользователя в куки на 7 дней
      setErrorMessage(''); // Очистка сообщения об ошибке в случае успешного запроса
    })
    .catch(error => {
      setErrorMessage(error.message); // Установка сообщения об ошибке
    });
};



  // Отправка сообщения
  const sendMessage = () => {
    if (!username) {
      alert("Please set a username first.");
      return;
    }

    fetch('/chat/post_message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: username , content: message }),
      })
      .then(response => {
        if (response.ok) {
          return response.json(); // Продолжаем только если ответ успешен
        }
        throw new Error('Something went wrong with the network response'); // Обработка неудачного запроса
      })
      .then(data => {
        setMessages([...messages, data]); // Обновляем состояние только при успешном ответе
        setMessage(''); // Очищаем поле ввода
      })
      .catch(error => {
        console.error('Fetch error:', error); // Выводим ошибку в консоль или обрабатываем её
      });      
      
  };

  const handleUserKeyDown = e => {
    if (e.key === 'Enter') {
      addUser();
    }
  };

  // Функция для обработки нажатия Enter для отправки сообщения
  const handleMessageKeyDown = e => {
    if (e.key === 'Enter') {
      sendMessage();
      e.preventDefault(); // Предотвратить дальнейшее "стандартное" действие (например, отправку формы)
    }
  };

  // Ваши функции addUser и sendMessage остаются без изменений
  function formatTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    // Добавление ведущего нуля, если число меньше 10
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes}`;
  }
  return (
    <div className="App">
      <header className="App-header">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user === username ? 'user-message' : 'other-message'}`}>
            <div className="author">{msg.user}</div>
            <div className="message-content">{msg.content}</div>
            <div className="message-time">{formatTime(msg.timestamp)}</div> {/* Добавлено время сообщения */}

          </div>
        ))}
      </div>
      </header>
      {!username ? (
        <div className="name-input">
          {errorMessage && <div style={{color: 'red', marginBottom: '10px'}}>{errorMessage}</div>}
          <input
            type="text"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            placeholder="Введи имя"
            style={{ borderColor: inputError ? 'red' : 'initial' }}
          />
          <button onClick={addUser}>Set Username</button>
      </div>
      
      ) : (
        <div className="message-input">
          <div className="message-input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message..."
              onKeyDown={handleMessageKeyDown}
            />
            <button onClick={sendMessage}>🚀</button> {/* Изменим текст на иконку, например, ракету */}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
