import api from '../../../api/axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../composants/Logo'
import Footer from '../../composants/Footer'
import Form from '../../composants/Form'
import './login.css'       


export default function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

const handleSubmit = async (e) => {
  e.preventDefault()
  const form = e.target
  const email = form.email.value
  const password = form.password.value
  const remember = form.remember.checked

  try {
    const response = await api.post('/user/login', { email, password })
    console.log('Login response:', response.data)
    const token = response.data.body?.token
    
    if (remember) {
      // Persiste même après fermeture du navigateur
      localStorage.setItem('authToken', token)
      console.log('Stored in localStorage:', localStorage.getItem('authToken'))
    } else {
      // Garde uniquement pour la session en cours
      sessionStorage.setItem('authToken', token)
      console.log('Stored in sessionStorage:', sessionStorage.getItem('authToken'))
    }

    navigate('/profile')
  } catch (err) {
    setError('Identifiants invalides',err)
  }
}

  return (
    <>
    
      <Logo />
      <main className="login-page ">
        <i className="fa fa-user-circle sign-in-icon login-icon" aria-hidden="true" /> 
      <h2 className="login-title">Sign In </h2>
        {error && <p className="login-error">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <label htmlFor="email">Username</label>
          <input
   id="email"
  name="email"  type="text"
 required  autoComplete="username" />
          <label htmlFor="password">Password</label>
           <input
  id="password"
  name="password"
  type="password"
  required
 autoComplete="current-password"  
 />

          <div className="login-remember">
            <input id="remember" name="remember" type="checkbox" className='remember' />
            <label htmlFor="remember" className='rememberme'>Remember me</label>
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </Form>
      </main>
      <Footer />
    </>
  )
}
