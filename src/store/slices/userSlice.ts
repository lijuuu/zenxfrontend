
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/api/types';
import { toast } from 'sonner';

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
    setUserLoading: (state) => {
      state.status = 'loading';
    },
    setUserSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.status = 'succeeded';
      state.profile = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    followUser: (state, action: PayloadAction<string>) => {
      if (state.profile && !state.profile.following?.includes(action.payload)) {
        state.profile.following = [...(state.profile.following || []), action.payload];
      }
    },
    unfollowUser: (state, action: PayloadAction<string>) => {
      if (state.profile && state.profile.following?.includes(action.payload)) {
        state.profile.following = state.profile.following.filter(id => id !== action.payload);
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    }
  },
});

export const { setUser, clearUser, setUserLoading, setUserSuccess, setUserError, followUser, unfollowUser, updateProfile } = userSlice.actions;
export default userSlice.reducer;
