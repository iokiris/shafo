import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/auth/AuthForm';
import IndexPage from './components/IndexPage/IndexPage';
import EmailConfirm from './components/auth/EmailConfirm/EmailConfirm'
import Exception from './components/exceptions/Exception';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/auth/*" element={<AuthForm />} />
          <Route path="/auth/confirm_email/:token" element={<EmailConfirm />} />
          <Route path="/" element={<IndexPage />} />
          <Route path="*" element={<Exception type="notFound" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
