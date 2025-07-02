import { createSlice } from '@reduxjs/toolkit'

// ➊ Chargement du token au démarrage depuis les deux stockages
const initialToken = sessionStorage.getItem('authToken') 
  || localStorage.getItem('authToken') 
  || null

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: initialToken },
  reducers: {
    // ➋ Stocke le token, avec payload = { token: string, remember: boolean }
    setToken: (state, action) => {
      const { token, remember } = action.payload
      state.token = token

      if (remember) {
        localStorage.setItem('authToken', token)
        sessionStorage.removeItem('authToken')
      } else {
        sessionStorage.setItem('authToken', token)
        localStorage.removeItem('authToken')
      }
    },
    // ➌ Supprime le token des deux stockages au logout
    clearToken: (state) => {
      state.token = null
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('authToken')
    },
  },
})

export const { setToken, clearToken } = authSlice.actions
export default authSlice.reducer
