import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaderboardEntry } from '@/api/types';

interface LeaderboardState {
  entries: LeaderboardEntry[];
  friendsEntries: LeaderboardEntry[];
  totalEntries: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  period: 'all' | 'monthly' | 'weekly';
}

const initialState: LeaderboardState = {
  entries: [],
  friendsEntries: [],
  totalEntries: 0,
  status: 'idle',
  error: null,
  currentPage: 1,
  period: 'weekly',
};

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async ({ page, limit, period }: { page: number; limit: number; period: 'all' | 'monthly' | 'weekly' }) => {
    // We'll use the new API from LeaderboardApi.ts in the future
    const response = await Promise.resolve({ leaderboard: [], total: 0 });
    return response;
  }
);

export const fetchFriendsLeaderboard = createAsyncThunk(
  'leaderboard/fetchFriendsLeaderboard',
  async () => {
    // We'll use the new API from LeaderboardApi.ts in the future
    const response = await Promise.resolve([]);
    return response;
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entries = action.payload.leaderboard;
        state.totalEntries = action.payload.total;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch leaderboard';
      })
      .addCase(fetchFriendsLeaderboard.fulfilled, (state, action) => {
        state.friendsEntries = action.payload;
      });
  },
});

export const { setCurrentPage, setPeriod } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
