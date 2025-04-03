
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import leaderboardReducer from './slices/leaderboardSlice';
import compilerReducer from './slices/compilerSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    leaderboard: leaderboardReducer,
    xCodeCompiler: compilerReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
