import { createSlice } from '@reduxjs/toolkit'

// ➊ On initialise depuis localStorage pour rester connecté après reload
const initialToken = localStorage.getItem('authToken') || null

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: initialToken },
  reducers: {
    // ➋ stocke le token après login
    setToken: (state, action) => {
      state.token = action.payload
      localStorage.setItem('authToken', action.payload)
    },
    // ➌ supprime tout au logout
    clearToken: (state) => {
      state.token = null
      localStorage.removeItem('authToken')
    },
  },
})

export const { setToken, clearToken } = authSlice.actions
export default authSlice.reducer