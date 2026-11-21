import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './Login.css';

const Login = () => {
  const [nameInput, setNameInput] = useState('');
  const { setUserName } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-logo">
          Task<span>Flow</span>
        </h1>
        <p className="login-subtitle">Welcome! Enter your name to access your workspace</p>

        <form onSubmit={handleSubmit} className="login-form">
         <input
          type="text"
          placeholder="e.g., Montaha Al Derawi"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="login-input"
          autoFocus
          required
          />
          <button type="submit" className="login-btn">
          Sign In →
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;