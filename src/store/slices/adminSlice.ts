// adminSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { AdminState } from '@/api/types';

const initialState: AdminState = {
  users: [],
  totalUsers: 0,
  nextPageToken: '',
  banHistories: {},
  loading: false,
  error: null,
  message: '',
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  adminID: null,
  expiresIn: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
      state.message = '';
    },
    loginSuccess: (state, action: { payload: { accessToken: string; refreshToken: string; expiresIn: number; adminID: string; message: string } }) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.adminID = action.payload.adminID;
      state.expiresIn = action.payload.expiresIn;
      state.message = action.payload.message;
    },
    loginFailure: (state, action: { payload: string }) => {
      state.loading = false;
      state.error = action.payload;
      state.message = '';
    },

    // Get users actions
    getUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUsersSuccess: (state, action: { payload: { users: any[]; totalCount: number; nextPageToken: string } }) => {
      state.loading = false;
      state.users = action.payload.users;
      state.totalUsers = action.payload.totalCount;
      state.nextPageToken = action.payload.nextPageToken;
    },
    getUsersFailure: (state, action: { payload: string }) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Utility actions
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.adminID = null;
      state.expiresIn = null;
      state.message = '';
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  clearError,
  logout,
} = adminSlice.actions;

export default adminSlice.reducer;