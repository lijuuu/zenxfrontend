
// adminApi.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { GenericResponse, LoginCredentials, LoginResponse, UsersResponse, UserCreateRequest, UserUpdateRequest, BanUserRequest } from '@/api/types';
import axiosInstance from '@/utils/axiosInstance';

const API_BASE_URL = 'http://localhost:7000/api/v1';

export const loginAdmin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<GenericResponse<any>>(
      `${API_BASE_URL}/admin/login`,
      credentials,
      { headers: { 'Content-Type': 'application/json' } }
    );
    const payload = response.data.payload;
    Cookies.set('accessToken', payload.accessToken, { expires: payload.expiresIn / 86400 });
    Cookies.set('refreshToken', payload.refreshToken);
    Cookies.set('isAdmin', 'true');
    return {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiresIn: payload.expiresIn,
      adminID: payload.adminID,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to login');
  }
};

export const getAllUsers = async (
  pageToken?: string, 
  limit?: number,
  roleFilter?: string,
  statusFilter?: string
): Promise<UsersResponse> => {
  try {
    const params: Record<string, any> = {};
    if (pageToken) params.page_token = pageToken;
    if (limit) params.limit = limit;
    if (roleFilter) params.role_filter = roleFilter;
    if (statusFilter) params.status_filter = statusFilter;
    
    const response = await axiosInstance.get<GenericResponse<any>>(`/admin/users`, { params });
    const payload = response.data.payload;
    return {
      users: payload.users,
      totalCount: payload.total_count,
      nextPageToken: payload.next_page_token,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch users');
  }
};

export const createUser = async (userData: UserCreateRequest): Promise<{ userId: string; message: string }> => {
  try {
    const response = await axiosInstance.post<GenericResponse<any>>(`/admin/users`, userData);
    const payload = response.data.payload;
    return {
      userId: payload.user_id,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to create user');
  }
};

export const updateUser = async (userData: UserUpdateRequest): Promise<{ userId: string; message: string }> => {
  try {
    const response = await axiosInstance.put<GenericResponse<any>>(`/admin/users/update`, userData);
    const payload = response.data.payload;
    return {
      userId: payload.user_id,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to update user');
  }
};

export const softDeleteUser = async (userId: string): Promise<{ userId: string; message: string }> => {
  try {
    const response = await axiosInstance.delete<GenericResponse<any>>(`/admin/users/soft-delete`, { 
      params: { user_id: userId } 
    });
    const payload = response.data.payload;
    return {
      userId: payload.user_id,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to delete user');
  }
};

export const verifyUser = async (userId: string): Promise<{ userId: string; message: string }> => {
  try {
    const response = await axiosInstance.post<GenericResponse<any>>(`/admin/users/verify`, null, {
      params: { user_id: userId }
    });
    const payload = response.data.payload;
    return {
      userId: payload.user_id,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to verify user');
  }
};

export const unverifyUser = async (userId: string): Promise<{ userId: string; message: string }> => {
  try {
    const response = await axiosInstance.post<GenericResponse<any>>(`/admin/users/unverify`, null, {
      params: { user_id: userId }
    });
    const payload = response.data.payload;
    return {
      userId: payload.user_id,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to unverify user');
  }
};

export const banUser = async (banData: BanUserRequest): Promise<{ userId: string; banId: string; message: string }> => {
  try {
    const response = await axiosInstance.post<GenericResponse<any>>(`/admin/users/ban`, banData);
    const payload = response.data.payload;
    return {
      userId: payload.user_id,
      banId: payload.ban_id,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to ban user');
  }
};

export const unbanUser = async (userId: string): Promise<{ userId: string; message: string }> => {
  try {
    const response = await axiosInstance.post<GenericResponse<any>>(`/admin/users/unban`, null, {
      params: { user_id: userId }
    });
    const payload = response.data.payload;
    return {
      userId: payload.user_id,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to unban user');
  }
};

export const getBanHistory = async (userId: string): Promise<{ bans: Array<any>; message: string }> => {
  try {
    const response = await axiosInstance.get<GenericResponse<any>>(`/admin/users/ban-history`, {
      params: { user_id: userId }
    });
    const payload = response.data.payload;
    return {
      bans: payload.bans,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to get ban history');
  }
};
