import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, CheckCheck, Sun, Moon } from 'lucide-react';

import { UserContext } from '../../context/UserContext';
import './Navbar.css';

const Navbar = React.memo(() => {
  const { userName, userRole, darkMode, toggleDarkMode } = useContext(UserContext);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: 'Welcome to TaskFlow! Your dashboard is ready.',
      time: 'Just now',
      read: false,
    },
    {
      id: 2,
      text: 'You have 15 pending tasks waiting for review.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 3,
      text: 'Overall completion rate reached 50%.',
      time: 'Yesterday',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-welcome">Welcome back, {userName}</h2>
        <span className="navbar-date">
          <Calendar size={14} />
          {today}
        </span>
      </div>

      <div className="navbar-right">
        <button
          className="notif-btn theme-btn"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <div className="notif-wrapper">
          <button
            className={`notif-btn ${showNotifs ? 'active' : ''}`}
            title="Notifications"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={19} />
            {unreadCount > 0 && <span className="notif-dot"></span>}
          </button>

          {showNotifs && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <h4>Notifications ({unreadCount})</h4>
                {unreadCount > 0 && (
                  <button className="mark-read-btn" onClick={markAllAsRead}>
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notif-list">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`notif-item ${!item.read ? 'unread' : ''}`}
                  >
                    <p className="notif-text">{item.text}</p>
                    <span className="notif-time">{item.time}</span>
                  </div>
                ))}
              </div>

              <div className="notif-footer">
                <Link to="/tasks" onClick={() => setShowNotifs(false)}>
                  View all tasks →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="navbar-divider"></div>

        <Link to="/settings" className="user-profile" title="Account Settings">
          <div className="avatar-wrapper">
            <div className="avatar">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="online-dot"></span>
          </div>
          <div className="user-info">
            <p className="user-name">{userName}</p>
            <span className="user-role">{userRole || 'Admin'}</span>
          </div>
        </Link>
      </div>
    </header>
  );
});

export default Navbar;