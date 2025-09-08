import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../lib/api';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Utilisateur non authentifié');
    try {
      const { body } = await apiFetch('/api/v1/user/profile', { token });
      return body;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const updateProfileName = createAsyncThunk(
  'profile/updateName',
  async (newName, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Utilisateur non authentifié');
    try {
      const { body } = await apiFetch('/api/v1/user/profile', {
        method: 'PUT',
        token,
        body: JSON.stringify({ userName: newName }),
      });
      return body;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null, // l’objet user
    accounts: [], // vos comptes simulés ou réels
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null, // message d’erreur
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
        state.data = {
          ...state.data, // garde les anciens champs
          ...action.payload, // écrase avec les nouveaux reçus
        };
      })

      .addCase(updateProfileName.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setAccounts, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
