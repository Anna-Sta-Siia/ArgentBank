import { useState, useEffect } from 'react'; // ajoute useEffect ici
import { useDispatch } from 'react-redux';
import {
  updateProfileName,
  fetchProfile,
} from '../../slices/profile/profileSlice';
import './profileHeader.css';

export default function ProfileHeader({ user, error }) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const dispatch = useDispatch();

  // Initialiser newName avec userName quand on passe en édition
  useEffect(() => {
    if (editing && user) {
      setNewName(user.userName || '');
    }
  }, [editing, user]);

  const handleSave = () => {
    if (!newName.trim()) return;
    dispatch(updateProfileName(newName))
      .unwrap()
      .then(() => dispatch(fetchProfile()))
      .catch(console.error)
      .finally(() => setEditing(false));
  };

  return (
    <section className="profile-header">
      <h1>
        Welcome back
        <br />
        {user.firstName} {user.lastName}!
      </h1>

      {editing ? (
        <div className="edit-name">
          <input
            name="username"
            autoComplete="off"
            type="text"
            spellCheck={false}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
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
  );
}
