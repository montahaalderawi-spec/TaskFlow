import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('taskflow_user') || '';
  });
  useEffect(() => {
    if (userName) {
      localStorage.setItem('taskflow_user', userName);
    } else {
      localStorage.removeItem('taskflow_user');
    }
  }, [userName]);

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};