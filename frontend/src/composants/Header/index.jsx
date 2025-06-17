// src/components/Header/index.jsx
import { Link }                     from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Logo                         from '../Logo'
import './header.css'

import { clearToken }   from '../../features/auth/authSlice'
import { clearProfile } from '../../features/profile/profileSlice'

export default function Header() {
  const dispatch = useDispatch()
  const token    = useSelector(state => state.auth.token)
  const user     = useSelector(state => state.profile.data)

  const handleLogout = () => {
    dispatch(clearToken())
    dispatch(clearProfile())
  }

  return (
    <nav className="main-nav">
      <Link to="/" className="main-nav-logo">
        <Logo />
      </Link>

      <div>
        {token ? (
          <>
            <span className="main-nav-item">
              <i className="fa fa-user-circle" />{' '}
              {/* Affiche Captain (userName), 
                  ou si absent, tombera sur Steve (firstName) */}
              {user ? user.userName : ''}
            </span>
            <button className="main-nav-item" onClick={handleLogout}>
              <i className="fa fa-sign-out" /> Sign Out
            </button>
          </>
        ) : (
          <Link className="main-nav-item" to="/login">
            <i className="fa fa-user-circle" /> Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
