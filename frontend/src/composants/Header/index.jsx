import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Logo from '../Logo';
import './header.css';

import { clearToken } from '../../slices/auth/authSlice';
import { clearProfile } from '../../slices/profile/profileSlice';
export default function Header() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.data);
  const navigate = useNavigate();
  // Déconnexion//
  const handleLogout = () => {
    dispatch(clearToken());
    dispatch(clearProfile());
    navigate('/login');
  };

  return (
    <nav className="main-nav">
      <Logo />

      <div>
        {token ? (
          <>
            <Link className="main-nav-item" to="/profile">
              <i className="fa fa-user-circle" /> {user ? user.userName : ''}
            </Link>

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
  );
}
