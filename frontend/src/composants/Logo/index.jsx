import { Link } from 'react-router-dom'
import logo from '../../assets/img/argentBankLogo.png'
import './logo.css'

export default function Logo({ to = '/' }) {
  return (
    <Link className="main-nav-logo" to={to} aria-label="Accueil Argent Bank">
      <img
        className="main-nav-logo-image"
        src={logo}
        alt="Argent Bank Logo"
      />
      <h1 className="sr-only">Argent Bank</h1>
    </Link>
  )
}
