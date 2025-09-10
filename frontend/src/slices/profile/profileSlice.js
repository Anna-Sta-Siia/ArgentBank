// src/slices/profile/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../lib/api.js';
import { DEMO_NOTICE_FLAG, DEMO_PROFILE_OVERLAY } from '../../constants/demo';

const isDemo = () => sessionStorage.getItem(DEMO_NOTICE_FLAG) === '1';
const readOverlay = () => {
  try {
    return JSON.parse(sessionStorage.getItem(DEMO_PROFILE_OVERLAY) || '{}');
  } catch {
    return {};
  }
};
const patchOverlay = (patch) => {
  const cur = readOverlay();
  sessionStorage.setItem(
    DEMO_PROFILE_OVERLAY,
    JSON.stringify({ ...cur, ...patch })
  );
};

/* =======================================================
   THUNKS
   ======================================================= */

// ---- Lecture du profil (ArgentBank = POST /profile) ----
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Utilisateur non authentifié');

    try {
      const { body } = await apiFetch('/api/v1/user/profile', {
        method: 'POST', // ⚠️ POST (spécification ArgentBank)
        token,
      });

      // 🔁 Merge overlay démo (écrase uniquement les champs présents dans l’overlay)
      const merged = isDemo() ? { ...body, ...readOverlay() } : body;
      return merged;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// ---- Édition du userName ----
export const updateProfileName = createAsyncThunk(
  'profile/updateName',
  async (newName, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Utilisateur non authentifié');

    const trimmed = String(newName || '').trim();

    // ✨ MODE DÉMO : pas d’appel PUT → on stocke localement et on renvoie le patch
    if (isDemo()) {
      patchOverlay({ userName: trimmed });
      return { userName: trimmed, _demo: true };
    }

    // 👑 ADMIN : vraie mise à jour serveur
    try {
      const { body } = await apiFetch('/api/v1/user/profile', {
        method: 'PUT',
        token,
        body: JSON.stringify({ userName: trimmed }),
      });
      return body;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

/* =======================================================
   SLICE
   ======================================================= */

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null, // objet user (firstName, lastName, userName, ...)
    accounts: [], // tes comptes simulés/réels
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
    clearProfile: (state) => {
      state.data = null;
      state.accounts = [];
      state.status = 'idle';
      state.error = null;
      // (optionnel) nettoyer l’overlay quand tu appelles clearProfile au logout :
      // sessionStorage.removeItem(DEMO_PROFILE_OVERLAY);
    },
    // Petit utilitaire local si tu veux MAJ instantanée sans passer par le thunk
    setUserNameLocal: (state, action) => {
      if (state.data) state.data.userName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // —— fetchProfile ——
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // —— updateProfileName ——
      .addCase(updateProfileName.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfileName.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Merge non destructif : écrase seulement les champs renvoyés
        state.data = {
          ...state.data,
          ...action.payload,
        };
      })
      .addCase(updateProfileName.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setAccounts, clearProfile, setUserNameLocal } =
  profileSlice.actions;
export default profileSlice.reducer;
