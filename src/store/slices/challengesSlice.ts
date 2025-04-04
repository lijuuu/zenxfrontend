
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';

interface ChallengeState {
  challenges: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChallengeState = {
  challenges: [],
  status: 'idle',
  error: null,
};

export const fetchChallenges = createAsyncThunk(
  'challenges/fetchChallenges',
  async () => {
    try {
      const response = await axiosInstance.get('/challenges');
      return response.data.payload;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch challenges');
      }
      throw error;
    }
  }
);

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenges.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.challenges = action.payload;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch challenges';
      });
  },
});

export default challengesSlice.reducer;
