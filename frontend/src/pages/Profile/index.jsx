import api from '../../../api/axios';
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../../assets/img/argentBankLogo.png'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  // Au montage, fetch profile
  
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/user/profile')
        const data = res.data.body
        setUser(data)
        setUsername(data.userName || '')
        // On simule des comptes (à remplacer par l'appel transactions plus tard)
        setAccounts([
          { title: 'Checking (x8349)', amount: '$2,082.79', desc: 'Available Balance' },
          { title: 'Savings (x6712)', amount: '$10,928.42', desc: 'Available Balance' },
          { title: 'Credit Card (x8349)', amount: '$184.30',  desc: 'Current Balance' },
        ])
      } catch {
        // pas de token ou erreur → redirige vers login
        navigate('/login')
      }
    })()
  }, [navigate])

  const handleEditToggle = () => setEditing(!editing)
  const handleNameSave = async () => {
    try {
      await api.put('/user/profile', { username })
      setUser(prev => ({ ...prev, userName: username }))
      setEditing(false)
    } catch {
      // gérer l'erreur si besoin
    }
  }

  if (!user) return null  // ou un Loader

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
        <div>
          <span className="main-nav-item">
            <i className="fa fa-user-circle" /> {user.userName || user.firstName}
          </span>
          <button className="main-nav-item" onClick={() => {
            localStorage.removeItem('authToken')
            navigate('/login')
          }}>
            <i className="fa fa-sign-out" /> Sign Out
          </button>
        </div>
      </nav>

      <main className="main bg-dark">
        <div className="header">
          <h1>
            Welcome back
            <br />
            {user.firstName} {user.lastName}!
          </h1>
          {editing ? (
            <div>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <button className="edit-button" onClick={handleNameSave}>
                Save
              </button>
            </div>
          ) : (
            <button className="edit-button" onClick={handleEditToggle}>
              Edit Name
            </button>
          )}
        </div>

        <h2 className="sr-only">Accounts</h2>
        {accounts.map((acct, i) => (
          <section className="account" key={i}>
            <div className="account-content-wrapper">
              <h3 className="account-title">Argent Bank {acct.title}</h3>
              <p className="account-amount">{acct.amount}</p>
              <p className="account-amount-description">{acct.desc}</p>
            </div>
            <div className="account-content-wrapper cta">
              <button className="transaction-button">
                View transactions
              </button>
            </div>
          </section>
        ))}
      </main>

      <footer className="footer">
        <p className="footer-text">Copyright 2020 Argent Bank</p>
      </footer>
    </>
  )
}
