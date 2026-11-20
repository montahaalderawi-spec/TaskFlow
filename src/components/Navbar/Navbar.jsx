import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import './Navbar.css';
const Navbar = React.memo (() => {
  const { userName } = useContext(UserContext);
  return (
   <header className="navbar">
      <h2>Welcome back, {userName}</h2>
      <div className="user-profile">
        <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
        <div>
          <p className="user-name">{userName}</p>
          <span className="user-role">Admin</span>
        </div>
      </div>
    </header>
  )
})

export default Navbar