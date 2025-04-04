
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/api/types';
import { toast } from 'sonner';
import { getCurrentUser } from '@/api/userApi';
import { AppThunk } from '@/store';

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

// Thunk action creator for fetching user profile
export const fetchUserProfile = (userId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setUserLoading());
    const userData = await getCurrentUser();
    dispatch(setUserSuccess(userData));
  } catch (error) {
    dispatch(setUserError(error instanceof Error ? error.message : 'Failed to fetch user profile'));
  }
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
        if (typeof state.profile.following === 'number') {
          state.profile.following = [action.payload];
        } else {
          state.profile.following = [...(state.profile.following || []), action.payload];
        }
        toast.success(`You are now following this user`);
      }
    },
    unfollowUser: (state, action: PayloadAction<string>) => {
      if (state.profile && state.profile.following) {
        if (Array.isArray(state.profile.following)) {
          state.profile.following = state.profile.following.filter(id => id !== action.payload);
        } else if (typeof state.profile.following === 'number' && state.profile.following > 0) {
          state.profile.following -= 1;
        }
        toast.success(`You have unfollowed this user`);
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { 
          ...state.profile, 
          ...action.payload,
          socials: {
            ...state.profile.socials,
            ...(action.payload.socials || {})
          }
        };
        toast.success('Profile updated successfully');
      }
    }
  },
});

export const { setUser, clearUser, setUserLoading, setUserSuccess, setUserError, followUser, unfollowUser, updateProfile } = userSlice.actions;
export default userSlice.reducer;
