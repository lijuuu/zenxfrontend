
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';

interface LeaderboardState {
  leaderboard: any[];
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  entries: any[];
  totalEntries: number;
  friendsLeaderboard: any[];
}

const initialState: LeaderboardState = {
  leaderboard: [],
  period: 'weekly',
  status: 'idle',
  error: null,
  currentPage: 1,
  entries: [],
  totalEntries: 0,
  friendsLeaderboard: []
};

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (options: { page?: number; limit?: number; period?: 'daily' | 'weekly' | 'monthly' | 'all-time' } = {}) => {
    const { page = 1, limit = 10, period = 'weekly' } = options;
    try {
      const response = await axiosInstance.get(`/leaderboard?period=${period}&page=${page}&limit=${limit}`);
      return { 
        data: response.data.payload,
        period,
        page 
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch leaderboard');
      }
      throw error;
    }
  }
);

export const fetchFriendsLeaderboard = createAsyncThunk(
  'leaderboard/fetchFriendsLeaderboard',
  async () => {
    try {
      const response = await axiosInstance.get('/leaderboard/friends');
      return response.data.payload;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch friends leaderboard');
      }
      throw error;
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leaderboard = action.payload.data;
        state.period = action.payload.period;
        state.entries = action.payload.data;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch leaderboard';
      })
      .addCase(fetchFriendsLeaderboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFriendsLeaderboard.fulfilled, (state, action) => {
        state.friendsLeaderboard = action.payload;
      })
      .addCase(fetchFriendsLeaderboard.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch friends leaderboard';
      });
  },
});

export const { setPeriod, setCurrentPage } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
