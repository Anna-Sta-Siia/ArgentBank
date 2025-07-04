import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchProfile, setAccounts } from '../../slices/profile/profileSlice';

import Header from '../../composants/Header';
import ProfileHeader from '../../composants/ProfileHeader';
import AccountCard from '../../composants/AccountCard';
import Footer from '../../composants/Footer';

import './profile.css';

export default function ProfilePage() {
  const dispatch = useDispatch();

  // — Récupération depuis Redux
  const user = useSelector((state) => state.profile.data);
  const accounts = useSelector((state) => state.profile.accounts);
  const status = useSelector((state) => state.profile.status);
  const error = useSelector((state) => state.profile.error);

  // État local pour les comptes
  const [accountsInitialized, setAccountsInitialized] = useState(false);

  //  On charge le profil
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
  //  Dès que `user` arrive, on pré-remplit l’input et on simule les comptes
  useEffect(() => {
    if (user && accounts.length === 0 && !accountsInitialized) {
      dispatch(
        setAccounts([
          {
            id: 1,
            title: 'Argent Bank Checking (x8349)',
            amount: '$2,082.79',
            desc: 'Available Balance',
          },
          {
            id: 2,
            title: 'Argent Bank Savings  (x6712)',
            amount: '$10,928.42',
            desc: 'Available Balance',
          },
          {
            id: 3,
            title: 'Argent Bank Credit Card (x8349)',
            amount: '$184.30',
            desc: 'Current Balance',
          },
        ])
      );
      setAccountsInitialized(true);
    }
  }, [user, accounts.length, accountsInitialized, dispatch]);

  // — Affichage des loaders / guards
  if (status === 'loading') return <p>Chargement du profil…</p>;
  if (!user) return null;

  return (
    <>
      <Header />
      <main className="pageofprofile-container">
        <ProfileHeader user={user} error={error} />
        <section className="accounts">
          <h2 className="sr-only">Accounts</h2>
          {accounts.map((acct) => (
            <AccountCard
              key={acct.id}
              title={acct.title}
              amount={acct.amount}
              desc={acct.desc}
              onView={() => {
                /* navigation future */
              }}
            />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
