import React from 'react'
import Navbar from '../Navbar/Navbar.jsx';
import Sidebar from '../Sidebar.jsx';
import {Outlet}from 'react-router-dom';
import './Layout.css';
const Layout = () => {
  return (
    <div className="layout-container">
        <Sidebar/>
    <div className="main-content">
      <Navbar />
        <div className="page-content">
        <Outlet/>
        </div>
    </div>
    </div>
  )
}

export default Layout