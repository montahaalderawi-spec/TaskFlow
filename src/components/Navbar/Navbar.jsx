import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar } from 'lucide-react';
import { UserContext } from '../../context/UserContext';
import './Navbar.css';
const Navbar = React.memo (() => {
  const { userName } = useContext(UserContext);
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
        <button className="notif-btn" title="Notifications">
          <Bell size={19} />
          <span className="notif-dot"></span>
        </button>

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
            <span className="user-role">Admin</span>
          </div>
        </Link>
      </div>
    </header>
  )
})

export default Navbar