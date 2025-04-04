
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import problemsReducer from './slices/problemsSlice';
import challengesReducer from './slices/challengesSlice';
import compilerReducer from './slices/compilerSlice';
import leaderboardReducer from './slices/leaderboardSlice';
import { ThunkAction, Action } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    problems: problemsReducer,
    challenges: challengesReducer,
    compiler: compilerReducer,
    leaderboard: leaderboardReducer,
    // Add xCodeCompiler reducer for compiler components
    xCodeCompiler: compilerReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store }; // Export as named export
export default store; // Also provide default export for backward compatibility

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
