import React, { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './AppRouter';
import { UserProvider, UserContext } from './context/UserContext';
import Login from './pages/Login';
import './App.css'

const AppContent = () => {
  const { userName } = useContext(UserContext);

  if (!userName) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;