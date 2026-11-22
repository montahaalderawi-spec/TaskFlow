import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Settings, LogOut, Menu,
  X, } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import './Sidebar.css' ;

const Sidebar = () => {
  const { setUserName } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    setUserName('');
  };
  const closeSidebar = () => setIsOpen(false);
  return (
    <>
      {/* زر القائمة للموبايل فقط */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* خلفية معتمة عند فتح القائمة على الموبايل */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">
            Task<span className="logo-accent">Flow</span>
          </h2>
          <button
            className="mobile-close-btn"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className="nav-link" onClick={closeSidebar}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/projects" className="nav-link" onClick={closeSidebar}>
            <FolderKanban size={18} />
            <span>Projects</span>
          </NavLink>
          <NavLink to="/tasks" className="nav-link" onClick={closeSidebar}>
            <CheckSquare size={18} />
            <span>My Tasks</span>
          </NavLink>
          <NavLink to="/team" className="nav-link" onClick={closeSidebar}>
            <Users size={18} />
            <span>Team Members</span>
          </NavLink>
          <NavLink to="/settings" className="nav-link" onClick={closeSidebar}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </>
  )
}

export default Sidebar