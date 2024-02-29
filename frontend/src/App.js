import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/auth/AuthForm';
import IndexPage from './components/IndexPage/IndexPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/auth/*" element={<AuthForm />} />
          <Route path="/" element={<IndexPage />} />
          {/* Здесь могут быть другие маршруты вашего приложения */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
