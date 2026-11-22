import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Settings, LogOut } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import './Sidebar.css' ;

const Sidebar = () => {
  const { setUserName } = useContext(UserContext);

  const handleLogout = () => {
    setUserName('');
  };
  return (
    <div className="sidebar">
      <h2 className="logo">
      Task<span className="logo-accent">Flow</span>
      </h2>
           <nav className="sidebar-nav">
        <NavLink to="/" end className="nav-link">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className="nav-link">
          <FolderKanban size={18} />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/tasks" className="nav-link">
          <CheckSquare size={18} />
          <span>My Tasks</span>
        </NavLink>
        <NavLink to="/team" className="nav-link">
          <Users size={18} />
          <span>Team Members</span>
        </NavLink>
        <NavLink to="/settings" className="nav-link">
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <button onClick={handleLogout} className="logout-btn">
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  )
}

export default Sidebar