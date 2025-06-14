import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'

function App() {
  const token = localStorage.getItem('authToken')  // ou state Redux plus tard

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/profile"
        element={
          token
            ? <Profile />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  )
}

export default App

