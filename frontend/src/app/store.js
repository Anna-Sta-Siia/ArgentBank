import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/auth/authSlice';
import profileReducer from '../slices/profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend([
      // Middleware personnalisé qui logue chaque action
      () => (next) => (action) => {
        console.log('Action dispatchée :', action);
        return next(action);
      },
    ]),
});
