import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../../slices/profile/profileSlice';
import Header from '../../composants/Header';
import ProfileHeader from '../../composants/ProfileHeader';
import Accounts from '../../composants/Accounts';
import Footer from '../../composants/Footer';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.data);
  const status = useSelector((state) => state.profile.status);
  const error = useSelector((state) => state.profile.error);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (status === 'loading') return <p>Chargement du profil…</p>;
  if (!user) return null;

  return (
    <>
      <Header />
      <main className="pageofprofile-container">
        <ProfileHeader user={user} error={error} />
        <Accounts />
      </main>
      <Footer />
    </>
  );
}
