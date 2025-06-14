import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../api/axios';
import '../../assets/css/main.css'; 
import logo from '../../assets/img/argentBankLogo.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post('/user/login', {
        email: username,
        password: password,
      });
      const token = response.data.body.token;
      // Stocke le token
      localStorage.setItem('authToken', token);
      if (remember) {
        // éventuel stockage persistant ou cookie
      }
      // redirige vers le profil
      navigate('/profile');
    } catch (err) {
  console.error(err);
  setError('Identifiants invalides');
}
  };

  return (
    <>
      <nav className="main-nav">
        <Link className="main-nav-logo" to="/">
          <img
            className="main-nav-logo-image"
            src={logo}
            alt="Argent Bank Logo"
          />
          <h1 className="sr-only">Argent Bank</h1>
        </Link>
      </nav>

      <main className="main bg-dark">
        <section className="sign-in-content">
          <i className="fa fa-user-circle sign-in-icon" />
          <h1>Sign In</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-remember">
              <input
                type="checkbox"
                id="remember-me"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="sign-in-button">
              Sign In
            </button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <p className="footer-text">Copyright 2020 Argent Bank</p>
      </footer>
    </>
  );
}
