import { Link, useNavigate } from 'react-router-dom';

export default function UserMenu({ userName }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return token ? (
    <>
      <span className="main-nav-item">
        <i className="fa fa-user-circle" /> {userName}
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
