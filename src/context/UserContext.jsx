import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('taskflow_user') || '';
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('taskflow_role') || 'Admin';
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('taskflow_theme') === 'dark';
  });

  useEffect(() => {
    if (userName) {
      localStorage.setItem('taskflow_user', userName);
    } else {
      localStorage.removeItem('taskflow_user');
    }
  }, [userName]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('taskflow_role', userRole);
    }
  }, [userRole]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('taskflow_theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('taskflow_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        userRole,
        setUserRole,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};