// src/features/profile/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// On récupère l’URL de l’API depuis .env ou on tombe sur localhost:3001
const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// ➊ Thunk pour charger le profil
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    if (!token) {
      return rejectWithValue('Utilisateur non authentifié')
    }

    const res = await fetch(`${API}/api/v1/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const text = await res.text()
      return rejectWithValue(`Échec du chargement : ${res.status} ${text}`)
    }
    const { body } = await res.json()
    return body  // on renvoie l’objet user complet
  }
)

// ➋ Thunk pour éditer le userName
export const updateProfileName = createAsyncThunk(
  'profile/updateName',
  async (newName, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    if (!token) {
      return rejectWithValue('Utilisateur non authentifié')
    }

    const res = await fetch(`${API}/api/v1/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type':  'application/json',
        Authorization:   `Bearer ${token}`,
      },
      body: JSON.stringify({ username: newName }),
    })
    if (!res.ok) {
      const text = await res.text()
      return rejectWithValue(`Échec de la mise à jour : ${res.status} ${text}`)
    }
    const { body } = await res.json()
    return body  // on renvoie l’objet user complet mis à jour
  }
)

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data:     null,   // l’objet user
    accounts: [],     // vos comptes simulés ou réels
    status:   'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error:    null,   // message d’erreur
  },
  reducers: {
    setAccounts:  (state, action) => {
      state.accounts = action.payload
    },
    clearProfile: state => {
      state.data     = null
      state.accounts = []
      state.status   = 'idle'
      state.error    = null
    },
  },
  extraReducers: builder => {
    builder
      // —— fetchProfile —— 
      .addCase(fetchProfile.pending, state => {
        state.status = 'loading'
        state.error  = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data   = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.error  = action.payload || action.error.message
      })

      // —— updateProfileName —— 
      .addCase(updateProfileName.pending, state => {
        state.status = 'loading'
        state.error  = null
      })
      .addCase(updateProfileName.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data   = action.payload  // on remplace tout l'objet user
      })
      .addCase(updateProfileName.rejected, (state, action) => {
        state.status = 'failed'
        state.error  = action.payload || action.error.message
      })
  }
})

export const { setAccounts, clearProfile } = profileSlice.actions
export default profileSlice.reducer
