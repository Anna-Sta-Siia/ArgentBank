import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../../slices/auth/authSlice';
import { fetchProfile } from '../../slices/profile/profileSlice';
import Header from '../../composants/Header';
import Footer from '../../composants/Footer';
import Form from '../../composants/Form';
import {
  DEMO_EMAIL,
  DEMO_PASS,
  DEMO_NOTICE_FLAG,
  DEMO_FLAG,
  DEMO_PROFILE_OVERLAY,
} from '../../constants/demo.js';
import './login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    const emailEl = document.getElementById('email');
    const passEl = document.getElementById('password');
    const clear = () => setError(null);
    emailEl?.addEventListener('input', clear);
    passEl?.addEventListener('input', clear);
    return () => {
      emailEl?.removeEventListener('input', clear);
      passEl?.removeEventListener('input', clear);
    };
  }, []);

  function fillDemo() {
    const emailEl = document.getElementById('email');
    const passEl = document.getElementById('password');
    if (!emailEl || !passEl) return;
    emailEl.value = DEMO_EMAIL;
    passEl.value = DEMO_PASS;
    setError(null);
    passEl.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const remember = form.remember.checked;

    setError(null);

    // 1) LOGIN
    let token;
    try {
      const data = await apiFetch('/api/v1/user/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      token = data?.body?.token;
      if (!token) throw new Error('NO_TOKEN');

      // Stocke le token (Redux persiste selon "remember")
      dispatch(setToken({ token, remember }));
    } catch (err) {
      console.error('Login failed:', err);
      const msg =
        err?.message === 'User not found!' ||
        err?.message === 'Password is invalid'
          ? 'E-mail ou mot de passe incorrect.'
          : 'Impossible de se connecter pour l’instant.';
      setError(msg);
      return;
    }

    // 2) DÉTERMINER le mode (démo vs normal) AVANT de charger le profil
    if (email === DEMO_EMAIL && password === DEMO_PASS) {
      // Mode démo → on garde l’overlay pour cet onglet/session
      sessionStorage.setItem(DEMO_FLAG, '1');
      sessionStorage.setItem(DEMO_NOTICE_FLAG, '1'); // si tu as un bandeau/Toast
    } else {
      // Login "normal" → on sort du mode démo et on nettoie tout résidu
      sessionStorage.removeItem(DEMO_FLAG);
      sessionStorage.removeItem(DEMO_NOTICE_FLAG);
      sessionStorage.removeItem(DEMO_PROFILE_OVERLAY);
    }

    // 3) PROFIL (⚠️ ArgentBank = POST /profile)
    try {
      await dispatch(fetchProfile()).unwrap();
    } catch (err) {
      console.error('Fetch profile failed:', err);
      setError('Connexion ok, mais échec du chargement du profil.');
      return;
    }

    // 4) Go profil
    navigate('/profile');
  }

  return (
    <>
      <Header />

      <main className="login-page">
        <div className="login-containeur">
          {/* --- Bouton Démo au-dessus du formulaire --- */}
          <div className="demo-cta">
            <button
              type="button"
              className="demo-button"
              onClick={fillDemo}
              aria-label="Préremplir les identifiants de démonstration"
            >
              Essayer le mode déмо
            </button>
          </div>

          <i
            className="fa fa-user-circle sign-in-icon login-icon"
            aria-hidden="true"
          />
          <h2 className="login-title">Sign In</h2>

          <Form id="login-form" onSubmit={handleSubmit}>
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
              {error || ' '}
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
