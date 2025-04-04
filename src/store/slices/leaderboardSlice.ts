
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaderboardEntry } from '@/api/types';
import axios from 'axios';
import { toast } from 'sonner';

interface LeaderboardState {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  totalEntries: number;
  currentPage: number;
  period: "weekly" | "monthly" | "all";
}

const initialState: LeaderboardState = {
  entries: [],
  loading: false,
  error: null,
  totalEntries: 0,
  currentPage: 1,
  period: "weekly"
};

// Fetch leaderboard data
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async ({ page = 1, limit = 10, period = "weekly" }: { page?: number; limit?: number; period?: "weekly" | "monthly" | "all" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/leaderboard?page=${page}&limit=${limit}&period=${period}`);
      return {
        entries: response.data.leaderboard || [],
        totalEntries: response.data.totalEntries || 0,
        period
      };
    } catch (error: any) {
      toast.error('Failed to load leaderboard data');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

// Fetch friends leaderboard
export const fetchFriendsLeaderboard = createAsyncThunk(
  'leaderboard/fetchFriendsLeaderboard',
  async (period: "weekly" | "monthly" | "all" | "daily" | "all-time", { rejectWithValue }) => {
    try {
      // Map the API period to our internal period format
      const apiPeriod = period === "daily" ? "weekly" : 
                        period === "all-time" ? "all" : period;
                        
      const response = await axios.get(`/api/leaderboard/friends?period=${apiPeriod}`);
      return {
        entries: response.data.leaderboard || [],
        totalEntries: response.data.totalEntries || 0,
        period: apiPeriod
      };
    } catch (error: any) {
      toast.error('Failed to load friends leaderboard data');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch friends leaderboard');
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.entries;
        state.totalEntries = action.payload.totalEntries;
        state.period = action.payload.period;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFriendsLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendsLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.entries;
        state.totalEntries = action.payload.totalEntries;
        state.period = action.payload.period;
      })
      .addCase(fetchFriendsLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setCurrentPage, setPeriod } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
