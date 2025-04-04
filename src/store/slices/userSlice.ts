
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserProfile, updateUserProfile } from '@/api/userApi';
import { UserProfile } from '@/api/types';

export interface UserState {
  profile: UserProfile | null;
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
    return {
      userID: response?.userID || '',
      userName: response?.userName || '',
      firstName: response?.firstName || '',
      lastName: response?.lastName || '',
      avatarURL: response?.avatarURL || response?.profileImage || '',
      email: response?.email || '',
      role: response?.role || 'user',
      country: response?.country || response?.location || '',
      countryCode: response?.countryCode || '',
      bio: response?.bio || '',
      joinedDate: response?.joinedDate || response?.createdAt?.toString() || '',
      problemsSolved: response?.problemsSolved || 0,
      dayStreak: response?.dayStreak || 0,
      currentStreak: response?.currentStreak || response?.dayStreak || 0,
      longestStreak: response?.longestStreak || response?.dayStreak || 0,
      currentRating: response?.currentRating || response?.ranking || 0,
      globalRank: response?.globalRank || response?.ranking || 0,
      isBanned: response?.isBanned || false,
      isVerified: response?.isVerified || false,
      primaryLanguageID: response?.primaryLanguageID || '',
      muteNotifications: response?.muteNotifications || false,
      profileImage: response?.profileImage || response?.avatarURL || '',
      socials: response?.socials || { github: '', twitter: '', linkedin: '', website: '' },
      createdAt: response?.createdAt || Date.now(),
      stats: response?.stats || {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 },
      },
      achievements: response?.achievements || {
        weeklyContests: 0,
        monthlyContests: 0,
        specialEvents: 0,
      },
      badges: response?.badges || [],
      activityHeatmap: response?.activityHeatmap || { startDate: '', data: [] },
    };
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: Partial<UserProfile>) => {
    const response = await updateUserProfile(profileData);
    return response;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
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
