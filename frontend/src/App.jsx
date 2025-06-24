
import { Routes, Route } from 'react-router-dom'

import Home      from './pages/Home'
import LoginPage from './pages/Login'
import Profile   from './pages/Profile'
import PrivateRoute from './composants/PrivateRoute'
import NotFound from './pages/Notfound'

export default function App() {
  return (
    <Routes>
      <Route path="/"      element={<Home />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Seule cette route est protégée */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
