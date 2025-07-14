
import { UserProfile } from '@/store/slices/authSlice';
import axiosInstance from '@/utils/axiosInstance';
import Cookies from 'js-cookie';


export const getUserProfile = async ({
  userID,
  username,
}: {
  userID?: string
  username?: string
} = {}): Promise<UserProfile> => {
  try {
    let url = '/users/profile'
    const params: Record<string, string> = {}
    let requiresAuth = true

    if (userID || username) {
      url = '/users/public/profile'
      requiresAuth = false
      if (username) params.username = username
      if (userID) params.userid = userID
    } else if (!Cookies.get("accessToken") && !Cookies.get("refreshToken")) {
      // no auth tokens at all - return early
      return {}
    }


    const res = await axiosInstance.get(url, {
      params,
      headers: {
        'X-Requires-Auth': requiresAuth ? 'true' : 'false',
      },
    })

    if (requiresAuth && res.data.payload.userProfile?.userID) {
      localStorage.setItem('userid', res.data.payload.userProfile.userID)
    }

    return res.data.payload.userProfile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw new Error('Failed to fetch user profile')
  }
}




export const updateUserProfile = async (
  profileData: Partial<UserProfile>
): Promise<UserProfile> => {
  const res = await axiosInstance.put(`/users/profile/update`, profileData, {
    headers: {
      'X-Requires-Auth': 'true',
    },
  });
  return res.data;
};

export interface SearchUsersResponse {
  users: UserProfile[];
  totalCount: number;
  nextPageToken?: string;
  message?: string;
}

export const searchUsers = async (
  query: string,
  pageToken?: string,
  limit: number = 10
): Promise<SearchUsersResponse> => {
  let url = `/users/search?query=${encodeURIComponent(query)}&limit=${limit}`;

  if (pageToken) {
    url += `&pageToken=${encodeURIComponent(pageToken)}`;
  }

  const res = await axiosInstance.get(url, {
    headers: {
      'X-Requires-Auth': 'true',
    },
  });

  return res.data.payload;
};

/** Follow a user (POST with query param) */
export const followUser = async (followeeID: string): Promise<{ success: boolean; message: string }> => {
  const res = await axiosInstance.post(
    "/users/follow",
    null, // no body
    {
      params: { followeeID },
      headers: { "X-Requires-Auth": "true" }
    }
  );
  return {
    success: res.data.Success ?? res.data.success,
    message: res.data.payload?.message || res.data.payload?.Message || res.data.Error?.Message || "",
  };
};

/** Unfollow a user (DELETE with query param) */
export const unfollowUser = async (followeeID: string): Promise<{ success: boolean; message: string }> => {
  const res = await axiosInstance.delete(
    "/users/follow",
    {
      params: { followeeID },
      headers: { "X-Requires-Auth": "true" }
    }
  );
  return {
    success: res.data.Success ?? res.data.success,
    message: res.data.payload?.message || res.data.payload?.Message || res.data.Error?.Message || "",
  };
};


/** Get followers (GET) */
export const getFollowers = async (userID: string, pageToken?: string, limit: number = 10) => {
  const res = await axiosInstance.get("/users/follow/followers", {
    params: { userID, pageToken, limit },
    headers: { "X-Requires-Auth": "true" }
  });

  // Return users from the payload structure
  return res.data.payload?.users || [];
};

/** Get following (GET) */
export const getFollowing = async (userID: string, pageToken?: string, limit: number = 10) => {
  const res = await axiosInstance.get("/users/follow/following", {
    params: { userID, pageToken, limit },
    headers: { "X-Requires-Auth": "true" }
  });

  // Return users from the payload structure
  return res.data.payload?.users || [];
};

/** Check if following (GET) */
export const checkFollow = async (userID: string) => {
  const res = await axiosInstance.get("/users/follow/check", {
    params: { userID },
    headers: { "X-Requires-Auth": "true" }
  });
  return res.data.payload?.isFollowing || false;
};
