import React from 'react'
import {Routes,Route} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Layout from './components/Layout/Layout';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Settings from './pages/Settings';
const AppRouter = () => {
  return (
    <Routes>
         <Route path="/" element={<Layout/>}>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/Projects" element={<Projects/>}/>
        <Route path="/Tasks" element={<Tasks />} />
        <Route path="/team" element={<Team />} />
        <Route path="/settings" element={<Settings />} />
        </Route>
    </Routes>
  )
}

export default AppRouter