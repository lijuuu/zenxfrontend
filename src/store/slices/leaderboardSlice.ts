
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';

interface LeaderboardState {
  leaderboard: any[];
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LeaderboardState = {
  leaderboard: [],
  period: 'weekly',
  status: 'idle',
  error: null,
};

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (period: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'weekly') => {
    try {
      const response = await axiosInstance.get(`/leaderboard?period=${period}`);
      return { data: response.data.payload, period };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch leaderboard');
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
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch leaderboard';
      });
  },
});

export const { setPeriod } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
