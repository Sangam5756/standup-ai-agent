import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import standupReducer from './standupSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    standup: standupReducer,
  },
});

export default store;
