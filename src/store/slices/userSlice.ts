
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserProfile, updateUserProfile } from '@/api/userApi';
// import { UserProfile } from '@/api/types';

export interface UserState {
  profile: {
    id: string;
    username: string;
    fullName: string;
    email: string;
    profileImage: string;
    country?: string;
    countryCode?: string;
    bio?: string;
    joinDate?: string;
    problemsSolved: number;
    currentStreak: number;
    longestStreak: number;
    currentRating: number;
    globalRank: number;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  status: 'idle',
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId: string) => {
    const response = await getUserProfile(userId);
    // Transform the UserProfile to match our Redux store shape
    return {
      id: response.id,
      username: response.username,
      fullName: response.fullName,
      email: response.email,
      profileImage: response.profileImage || '',
      country: response.location,
      bio: response.bio,
      joinDate: response.joinedDate,
      problemsSolved: response.problemsSolved,
      currentStreak: response.dayStreak,
      longestStreak: response.dayStreak, // Use dayStreak as a fallback
      currentRating: response.ranking,
      globalRank: response.ranking
    };
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: Partial<UserState['profile']>) => {
    const response = await updateUserProfile(profileData);
    return response;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState['profile']>) => {
      state.profile = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user profile';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload };
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
