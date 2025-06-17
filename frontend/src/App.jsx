import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import LoginPage from './pages/Login'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/"       element={<Home />}       />
      <Route path="/login"  element={<LoginPage />} />
      <Route path="/profile" element={<Profile />}   />
    </Routes>
  )
}
