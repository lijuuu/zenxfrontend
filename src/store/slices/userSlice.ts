
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
    // Transform the UserProfile to match our Redux store shape
    return {
      userID: response.id || response.userID,
      userName: response.username || response.userName,
      firstName: response.firstName || response.fullName?.split(' ')[0] || '',
      lastName: response.fullName?.split(' ')[1] || '',
      avatarURL: response.profileImage || response.avatarURL || '',
      email: response.email,
      role: response.role || 'user',
      country: response.location || response.country || '',
      isBanned: response.isBanned || false,
      isVerified: response.isVerified || false,
      primaryLanguageID: response.primaryLanguageID || '',
      muteNotifications: response.muteNotifications || false,
      socials: {
        github: response.githubProfile || '',
        twitter: '',
        linkedin: '',
        website: response.website || '',
      },
      createdAt: response.joinedDate ? new Date(response.joinedDate).getTime() : Date.now(),
      joinedDate: response.joinedDate,
      problemsSolved: response.problemsSolved,
      dayStreak: response.dayStreak,
      ranking: response.ranking,
      profileImage: response.profileImage,
      followers: response.followers,
      following: response.following,
      countryCode: response.countryCode,
      bio: response.bio,
      currentStreak: response.dayStreak,
      longestStreak: response.dayStreak,
      currentRating: response.ranking,
      globalRank: response.ranking,
      stats: {
        easy: { solved: 0, total: 0 },
        medium: { solved: 0, total: 0 },
        hard: { solved: 0, total: 0 },
      },
      achievements: {
        weeklyContests: 0,
        monthlyContests: 0,
        specialEvents: 0,
      },
      badges: [],
      activityHeatmap: { startDate: '', data: [] },
    } as UserProfile;
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
