import { useState } from 'react';
import { apiFetch } from '../../lib/api.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../../slices/auth/authSlice';
import { fetchProfile } from '../../slices/profile/profileSlice';
import Header from '../../composants/Header';
import Footer from '../../composants/Footer';
import Form from '../../composants/Form';
import './login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const remember = form.remember.checked;

    try {
      // Login pour récupérer le token (utilise l’API_BASE)
      const data = await apiFetch('/api/v1/user/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const token = data.body?.token;
      if (!token) {
        throw new Error('Token manquant dans la réponse');
      }

      //  Stockage du token dans Redux
      dispatch(setToken({ token, remember }));

      // Chargement du profil
      await dispatch(fetchProfile()).unwrap();

      //  Redirection vers la page protégée
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError('Identifiants invalides');
    }
  }

  return (
    <>
      <Header />

      <main className="login-page">
        <div className="login-containeur">
          <i
            className="fa fa-user-circle sign-in-icon login-icon"
            aria-hidden="true"
          />
          <h2 className="login-title">Sign In</h2>

          <Form onSubmit={handleSubmit}>
            <label htmlFor="email">Username</label>
            <input
              id="email"
              name="email"
              type="text"
              required
              autoComplete="username"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
            <p className={`login-error ${error ? 'visible' : 'hidden'}`}>
              {error || ' '}
            </p>
            <div className="login-remember">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="remember"
              />
              <label htmlFor="remember" className="rememberme">
                Remember me
              </label>
            </div>

            <button type="submit" className="login-button">
              Sign In
            </button>
          </Form>
        </div>
      </main>

      <Footer />
    </>
  );
}
