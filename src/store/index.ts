
import { configureStore } from '@reduxjs/toolkit';
import leaderboardReducer from './slices/leaderboardSlice';
import compilerReducer from './slices/compilerSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    leaderboard: leaderboardReducer,
    xCodeCompiler: compilerReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
