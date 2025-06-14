// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
// 👇 tes slices (à créer ensuite)
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});
