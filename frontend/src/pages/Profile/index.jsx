// src/pages/Profile/index.jsx
import { useEffect, useState }      from 'react'
import { useNavigate }              from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import {
  fetchProfile,
  updateProfileName,
  setAccounts,
  clearProfile
} from '../../features/profile/profileSlice'
import { clearToken }               from '../../features/auth/authSlice'

import Header        from '../../composants/Header'
import Footer        from '../../composants/Footer'
import AccountCard   from '../../composants/AccountCard'
import './profile.css'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // — Récupération du token, du profil, etc. depuis Redux
  const token    = useSelector(state => state.auth.token)
  const user     = useSelector(state => state.profile.data)
  const accounts = useSelector(state => state.profile.accounts)
  const status   = useSelector(state => state.profile.status)
  const error    = useSelector(state => state.profile.error)

  // État local pour l’édition du nom
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState('')

  // 1) Si pas de token → redirection vers /login, sinon on charge le profil
  useEffect(() => {
    if (!token) {
      navigate('/login')
    } else {
      dispatch(fetchProfile())
    }
  }, [token, dispatch, navigate])

  // 2) Dès que `user` arrive, on pré-remplit l’input et on simule les comptes
  useEffect(() => {
    if (user) {
      setNewName(user.userName || '')
      if (accounts.length === 0) {
        dispatch(setAccounts([
          { id: 1, title: 'Checking (x8349)',   amount: '$2,082.79', desc: 'Available Balance' },
          { id: 2, title: 'Savings  (x6712)',   amount: '$10,928.42', desc: 'Available Balance' },
          { id: 3, title: 'Credit Card (x8349)', amount: '$184.30',   desc: 'Current Balance' },
        ]))
      }
    }
  }, [user, accounts.length, dispatch])

  // 3) Déconnexion
  const handleLogout = () => {
    dispatch(clearToken())
    dispatch(clearProfile())
    navigate('/login')
  }

  // 4) Sauvegarde du nouveau nom via le thunk updateProfileName
const handleSave = () => {
  if (!newName.trim()) return
  dispatch(updateProfileName(newName))
    .unwrap()
    .then(() => {
      // on a bien écrit en base userName = "Iron" → on recharge
      return dispatch(fetchProfile())
    })
    .catch(console.error)
    .finally(() => setEditing(false))
}

  // — Affichage des loaders / guards
  if (status === 'loading') return <p>Chargement du profil…</p>
  if (!user) return null

  return (
    <>
      {/* Le Header lit token & user dans le store pour afficher Sign Out + userName */}
      <Header onLogout={handleLogout} />

      <main className="pageofprofile-container">
        <section className="profile-header">
          <h1>
            Welcome back<br/>
            {user.firstName} {user.lastName}!
          </h1>

          {editing ? (
            <div className="edit-name">
              {/* name="username" indispensable pour votre thunk */}
              <input
                name="username"
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
              <button onClick={handleSave} className="edit-button">
                Save
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="edit-button">
              Edit Name
            </button>
          )}

          {error && <p className="profile-error">{error}</p>}
        </section>
        <section className='accounts'>
        <h2 className="sr-only">Accounts</h2>
        {accounts.map(acct => (
          <AccountCard
            key={acct.id}
            title={acct.title}
            amount={acct.amount}
            desc={acct.desc}
            onView={() => {/* navigation future */}}
          />
        ))}
        </section>
      </main>

      <Footer />
    </>
  )
}
