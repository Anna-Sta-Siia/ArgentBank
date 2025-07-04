import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken } from '../../slices/auth/authSlice';
import { clearProfile } from '../../slices/profile/profileSlice';
import './userMenu.css';

export default function UserMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.data);

  const handleSignOut = () => {
    dispatch(clearToken());
    dispatch(clearProfile());
    navigate('/login');
  };

  return token ? (
    <>
      <span className="main-nav-item">
        <i className="fa fa-user-circle" /> {user ? user.userName : ''}
      </span>
      <button
        className="main-nav-item"
        onClick={handleSignOut}
        aria-label="Se déconnecter"
      >
        <i className="fa fa-sign-out" /> Sign Out
      </button>
    </>
  ) : (
    <Link className="main-nav-item" to="/login">
      <i className="fa fa-user-circle" /> Sign In
    </Link>
  );
}
