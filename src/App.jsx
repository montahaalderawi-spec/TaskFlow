import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './AppRouter'
import { UserProvider } from './context/UserContext'
const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </UserProvider>
  )
}

export default App