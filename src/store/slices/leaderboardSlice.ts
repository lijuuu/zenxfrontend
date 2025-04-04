
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaderboardEntry } from '@/api/types';
import axios from 'axios';
import { toast } from 'sonner';

interface LeaderboardState {
  entries: LeaderboardEntry[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalEntries: number;
  currentPage: number;
  period: "weekly" | "monthly" | "all";
}

const initialState: LeaderboardState = {
  entries: [],
  status: 'idle',
  error: null,
  totalEntries: 0,
  currentPage: 1,
  period: "weekly"
};

interface FetchLeaderboardParams {
  page?: number;
  limit?: number;
  period?: "weekly" | "monthly" | "all";
}

// Fetch leaderboard data
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async ({ page = 1, limit = 10, period = "weekly" }: FetchLeaderboardParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/leaderboard?page=${page}&limit=${limit}&period=${period}`);
      return {
        entries: response.data.leaderboard || [],
        totalEntries: response.data.totalEntries || 0,
        period,
        page
      };
    } catch (error: any) {
      toast.error('Failed to load leaderboard data');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPeriod: (state, action) => {
      state.period = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entries = action.payload.entries;
        state.totalEntries = action.payload.totalEntries;
        state.period = action.payload.period;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const { setCurrentPage, setPeriod } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
