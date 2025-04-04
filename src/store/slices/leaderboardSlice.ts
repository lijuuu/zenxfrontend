
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LeaderboardState, UserProfile, LeaderboardEntry } from '@/api/types';

// Async thunk for fetching leaderboard data
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async ({ page, limit, period }: { page?: number, limit?: number, period?: 'weekly' | 'monthly' | 'all' } = {}, { rejectWithValue }) => {
    try {
      // In a real app, we would make an API call here
      // const response = await axios.get('/api/leaderboard');
      // return response.data;
      
      // For now, return mock data
      return {
        globalLeaderboard: [
          // Mock data for global leaderboard
          {
            userID: "user1",
            userName: "codemaster",
            firstName: "Alex",
            lastName: "Johnson",
            avatarURL: "https://i.pravatar.cc/150?img=1",
            email: "alex@example.com",
            role: "user",
            country: "USA",
            countryCode: "US",
            isBanned: false,
            isVerified: true,
            primaryLanguageID: "js",
            muteNotifications: false,
            socials: {
              github: "alexj",
              twitter: "alexj",
              linkedin: "alexj",
              website: "alexj.com"
            },
            createdAt: Date.now() - 10000000,
            problemsSolved: 120,
            dayStreak: 30,
            ranking: 1,
            stats: {
              easy: { solved: 50, total: 50 },
              medium: { solved: 45, total: 50 },
              hard: { solved: 25, total: 30 }
            },
            achievements: {
              weeklyContests: 10,
              monthlyContests: 5,
              specialEvents: 3
            },
            badges: [],
            activityHeatmap: {
              data: [],
              totalContributions: 200,
              currentStreak: 30,
              longestStreak: 30
            }
          },
          // Add more users here
        ],
        friendsLeaderboard: [
          // Mock data for friends leaderboard
          {
            userID: "user2",
            userName: "friendcoder",
            firstName: "Sam",
            lastName: "Smith",
            avatarURL: "https://i.pravatar.cc/150?img=2",
            email: "sam@example.com",
            role: "user",
            country: "UK",
            countryCode: "GB",
            isBanned: false,
            isVerified: true,
            primaryLanguageID: "python",
            muteNotifications: true,
            socials: {
              github: "samsmith",
              twitter: "samsmith",
              linkedin: "samsmith",
              website: "samsmith.com"
            },
            createdAt: Date.now() - 20000000,
            problemsSolved: 80,
            dayStreak: 15,
            ranking: 5,
            stats: {
              easy: { solved: 30, total: 50 },
              medium: { solved: 35, total: 50 },
              hard: { solved: 15, total: 30 }
            },
            achievements: {
              weeklyContests: 8,
              monthlyContests: 3,
              specialEvents: 1
            },
            badges: [],
            activityHeatmap: {
              data: [],
              totalContributions: 150,
              currentStreak: 15,
              longestStreak: 20
            }
          },
          // Add more friends here
        ],
        // For backward compatibility
        entries: [],
        totalEntries: 0,
        currentPage: page || 1,
        period: period || 'weekly'
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

// For backward compatibility
export const fetchFriendsLeaderboard = fetchLeaderboard;

const initialState: LeaderboardState = {
  globalLeaderboard: [],
  friendsLeaderboard: [],
  status: 'idle',
  error: null,
  // For backward compatibility
  entries: [],
  totalEntries: 0,
  currentPage: 1,
  period: 'weekly',
  loading: false
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = 'loading';
        state.loading = true; // For backward compatibility
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action: PayloadAction<{
        globalLeaderboard: UserProfile[],
        friendsLeaderboard: UserProfile[],
        entries?: LeaderboardEntry[],
        totalEntries?: number,
        currentPage?: number,
        period?: 'weekly' | 'monthly' | 'all'
      }>) => {
        state.status = 'succeeded';
        state.loading = false; // For backward compatibility
        
        state.globalLeaderboard = action.payload.globalLeaderboard;
        state.friendsLeaderboard = action.payload.friendsLeaderboard;
        
        // For backward compatibility
        if (action.payload.entries) {
          state.entries = action.payload.entries;
        }
        if (action.payload.totalEntries !== undefined) {
          state.totalEntries = action.payload.totalEntries;
        }
        if (action.payload.currentPage !== undefined) {
          state.currentPage = action.payload.currentPage;
        }
        if (action.payload.period) {
          state.period = action.payload.period;
        }
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; // For backward compatibility
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPage } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
