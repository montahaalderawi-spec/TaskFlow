import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css' ;

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">
      Task<span className="logo-accent">Flow</span>
      </h2>
    <nav className="sidebar-nav">
      <NavLink to="/" end className="nav-link">Dashboard</NavLink>
      <NavLink to="/projects" className="nav-link">Projects</NavLink>
      <NavLink to="/tasks" className="nav-link">My Tasks</NavLink>
      <NavLink to="/team" className="nav-link">Team Members</NavLink>
      <NavLink to="/settings" className="nav-link">Settings</NavLink>
    </nav>
    </div>
  )
}

export default Sidebar