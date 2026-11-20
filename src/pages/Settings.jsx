import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './Settings.css';

const Settings = () => {
  const { userName, setUserName } = useContext(UserContext);
  const [inputValue, setInputValue] = useState(userName);

  const handleSave = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      setUserName(inputValue.trim());
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2 className="settings-title">Account Settings</h2>
        <form onSubmit={handleSave} className="settings-form">
          <div className="form-group">
            <label htmlFor="username" className="settings-label">
              Display Name
            </label>
            <input
              id="username"
              type="text"
              className="settings-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <button type="submit" className="settings-btn">
            Save Name
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;