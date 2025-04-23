export interface ApiResponse {
  success: boolean;
  status: number;
  payload: any;
  error: any;
}

export interface AuthState {
  userId: string | null;
  email: string | null;
  loading: boolean;
  isVerified: boolean;
  error: { message: string; code?: number; type?: string } | null;
  successMessage: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  userProfile: UserProfile | null;
  lastResendTimestamp: number | null;
  resendCooldown: boolean;
  expiryAt: number | null;
}

export interface UserProfile {
  userID: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  avatarURL?: string;
  bio?: string;
  country?: string;
  isOnline?: boolean;
  ranking?: number;
  joinedDate?: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  role: string;
  status: string;
  lastActivity?: string;
  problemsSolved?: number;
  stats?: {
    easy?: { solved: number };
    medium?: { solved: number };
    hard?: { solved: number };
  };
  achievements?: {
    weeklyContests?: number;
    monthlyContests?: number;
    specialEvents?: number;
  };
}

export interface LoginUserResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userID: string;
  userProfile: UserProfile;
  message: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  adminID?: string;
  message: string;
}

export interface UsersResponse {
  users: Array<UserProfile>;
  totalCount: number;
  nextPageToken?: string;
}

export interface UserCreateRequest {
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  auth_type: string;
  password: string;
  confirm_password: string;
}

export interface UserUpdateRequest {
  user_id: string;
  first_name?: string;
  last_name?: string;
  country?: string;
  role?: string;
  email?: string;
  password?: string;
  primary_language_id?: string;
  mute_notifications?: boolean;
  socials?: {
    github?: string;
    twitter?: string;
  };
}

export interface BanUserRequest {
  user_id: string;
  ban_type: string;
  ban_reason: string;
  ban_expiry?: string;
}

export interface GenericResponse<T> {
  success: boolean;
  status: number;
  payload: T;
  error?: {
    type: string;
    message: string;
    details?: any;
  };
}
