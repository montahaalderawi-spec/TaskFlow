import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { User, ArrowRight, CheckCircle2, Users, BarChart3, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');
  const { setUserName } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();

    if (!trimmedName) {
      setError('Please enter your name to continue.');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    setError('');
    setUserName(trimmedName);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* الجزء اليسار: الهوية والميزات */}
        <div className="login-brand-panel">
          <div className="brand-top">
            <h1 className="brand-logo">
              Task<span>Flow</span>
            </h1>
            <p className="brand-tagline">
              Organize projects, empower your team, and track progress effortlessly in one workspace.
            </p>
          </div>

          <div className="brand-features">
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircle2 size={18} />
              </div>
              <span>Smart task tracking &amp; status filtering</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Users size={18} />
              </div>
              <span>Built for small teams &amp; collaboration</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <BarChart3 size={18} />
              </div>
              <span>Real-time analytics &amp; progress overview</span>
            </div>
          </div>

          <div className="brand-footer">
            <span>TaskFlow Workspace &copy; 2026</span>
          </div>
        </div>

        {/* الجزء اليمين: فورم الدخول */}
        <div className="login-form-panel">
          <div className="form-header">
            <h2>Welcome back</h2>
            <p>Enter your name to access your team dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="input-group">
              <label htmlFor="username">Full Name</label>
              <div className={`input-wrapper ${error ? 'input-error' : ''}`}>
                <User size={18} className="input-icon" />
                <input
                  id="username"
                  type="text"
                  placeholder="e.g., Montaha Al Derawi"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (error) setError('');
                  }}
                  autoFocus
                />
              </div>
              {error && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {error}
                </span>
              )}
            </div>

            <button type="submit" className="login-btn">
              <span>Sign In to Workspace</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;