import { Link } from 'react-router-dom'
import './notfound.css'
import Header        from '../../composants/Header'
import Footer        from '../../composants/Footer'

export default function NotFound() {
  return (
    <>
    <Header/>
    <main className="notfound">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-text">Oups ! La page que vous demandez n’existe pas.</p>
      <Link to="/" className="notfound-link">Retourner sur la page d’accueil</Link>
    </main>
    <Footer/>
    </>
  )
}
