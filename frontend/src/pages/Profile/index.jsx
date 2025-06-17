import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../../composants/Header'
import Footer from '../../composants/Footer'
import AccountCard from '../../composants/AccountCard'
import './profile.css' 
export default function Profile() {
  const [user, setUser]         = useState(null)
  const [accounts, setAccounts] = useState([])
  const [editing, setEditing]   = useState(false)
  const [newName, setNewName]   = useState('')
  const navigate                = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('authToken')

    // Si pas de token, on renvoie au login
    if (!token) {
      navigate('/login')
      return
    }

    // Appel GET /user/profile avec Fetch
    fetch('http://localhost:3001/api/v1/user/profile', {
      method:  'GET',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          // Si le serveur renvoie 401 ou un autre code, on renvoie au login
          throw new Error(`Statut ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        // data.body contient l’objet user
        const profile = data.body
        setUser(profile)
        setNewName(profile.userName || profile.firstName)

        // Si ton back ne renvoie pas les comptes,
        // simule-les comme avant :
        setAccounts([
          { id: 1, title: 'Checking (x8349)', amount: '$2,082.79', desc: 'Available Balance' },
          { id: 2, title: 'Savings (x6712)',  amount: '$10,928.42', desc: 'Available Balance' },
          { id: 3, title: 'Credit Card (x8349)', amount: '$184.30',  desc: 'Current Balance' },
        ])
      })
      .catch(err => {
        console.error('Impossible de récupérer le profil', err)
        navigate('/login')
      })
  }, [navigate])

  // Fonction pour sauvegarder le nouveau nom
  function handleSave() {
    const token = localStorage.getItem('authToken')
    if (!token) return

    fetch('http://localhost:3001/api/v1/user/profile', {
      method:  'PUT',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ username: newName }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Statut ${res.status}`)
        return res.json()
      })
      .then(() => {
        setUser(prev => ({ ...prev, userName: newName }))
        setEditing(false)
      })
      .catch(err => {
        console.error('Erreur lors de la mise à jour du nom', err)
      })
  }

  if (!user) {
    return <p>Chargement du profil…</p>
  }

  return (
    <>
      <Header userName={user.userName || user.firstName} />

      <main className="page-container">
        <section className="profile-header">
          <h1>
            Welcome back
            <br />
            {user.firstName} {user.lastName}!
          </h1>

          {editing ? (
            <div className="edit-name">
              <input
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
        </section>

        <h2 className="sr-only">Accounts</h2>
        {accounts.map(acct => (
          <AccountCard
            key={acct.id}
            title={acct.title}
            amount={acct.amount}
            desc={acct.desc}
            onView={() => {
              /* future navigation vers /transactions/… */
            }}
          />
        ))}
      </main>

      <Footer />
    </>
  )
}