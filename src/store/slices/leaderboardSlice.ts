
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaderboardState, UserProfile } from '@/api/types';
import { getLeaderboard } from '@/api/leaderboardApi';
import { AppThunk } from '@/store';

const initialState: LeaderboardState = {
  globalLeaderboard: [],
  friendsLeaderboard: [],
  status: 'idle',
  error: null
};

// Thunk for fetching leaderboard data
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (params: { period: "weekly" | "monthly" | "all" }) => {
    const data = await getLeaderboard(params);
    return data;
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setLeaderboardLoading: (state) => {
      state.status = 'loading';
    },
    setLeaderboardSuccess: (state, action: PayloadAction<UserProfile[]>) => {
      state.status = 'succeeded';
      state.globalLeaderboard = action.payload;
    },
    setLeaderboardError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    setFriendsLeaderboard: (state, action: PayloadAction<UserProfile[]>) => {
      state.friendsLeaderboard = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Fix: Handle both array response and object with leaderboard property
        if (Array.isArray(action.payload)) {
          state.globalLeaderboard = action.payload;
        } else if (action.payload && 'leaderboard' in action.payload) {
          // @ts-ignore - We're handling type conversion safely here
          state.globalLeaderboard = action.payload.leaderboard;
        }
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch leaderboard';
      });
  }
});

export const { 
  setLeaderboardLoading, 
  setLeaderboardSuccess, 
  setLeaderboardError,
  setFriendsLeaderboard
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
