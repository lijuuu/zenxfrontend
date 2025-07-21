
// adminApi.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { GenericResponse, LoginCredentials, AdminLoginResponse, UsersResponse } from '@/api/types';
import adminAxiosInstance from '@/utils/axiosAdminInstance';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000'}/api/v1`;

export const loginAdmin = async (credentials: LoginCredentials): Promise<AdminLoginResponse> => {
  try {
    const response = await axios.post<GenericResponse<any>>(
      `${API_BASE_URL}/admin/login`,
      credentials,
      { headers: { 'Content-Type': 'application/json' } }
    );
    const payload = response.data.payload;
    Cookies.set('adminAccessToken', payload.accessToken, { expires: payload.expiresIn / 86400 });
    return {
      accessToken: payload.accessToken,
      expiresIn: payload.expiresIn,
      adminID: payload.adminID,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to login');
  }
};

export const getAllUsers = async (
  nextPageToken?: string,
  prevPageToken?: string,
  limit: number = 10,
  roleFilter?: string,
  statusFilter?: string,
  nameFilter?: string,
  emailFilter?: string,
  fromDateFilter?: number,
  toDateFilter?: number
): Promise<UsersResponse> => {
  try {
    const params: Record<string, any> = {};
    if (nextPageToken) params.nextPageToken = nextPageToken;
    if (prevPageToken) params.prevPageToken = prevPageToken;

    if (limit) params.limit = limit;
    if (roleFilter) params.roleFilter = roleFilter;
    if (statusFilter) params.statusFilter = statusFilter;
    if (nameFilter) params.nameFilter = nameFilter;
    if (emailFilter) params.emailFilter = emailFilter;
    if (fromDateFilter) params.fromDateFilter = fromDateFilter;
    if (toDateFilter) params.toDateFilter = toDateFilter;

    const response = await adminAxiosInstance.get<GenericResponse<any>>(`/admin/users`, { params });
    const payload = response.data.payload;
    return {
      users: payload.users,
      totalCount: payload.totalCount,
      prevPageToken: payload.prevPageToken,
      nextPageToken: payload.nextPageToken,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch users');
  }
};

// export const createUser = async (userData: UserCreateRequest): Promise<{ userId: string; message: string }> => {
//   try {
//     const response = await adminAxiosInstance.post<GenericResponse<any>>(`/admin/users`, userData);
//     const payload = response.data.payload;
//     return {
//       userId: payload.userId,
//       message: payload.message,
//     };
//   } catch (error: any) {
//     throw new Error(error.response?.data?.error?.message || 'Failed to create user');
//   }
// };

// export const updateUser = async (userData: UserUpdateRequest): Promise<{ userId: string; message: string }> => {
//   try {
//     const response = await adminAxiosInstance.put<GenericResponse<any>>(`/admin/users/update`, userData);
//     const payload = response.data.payload;
//     return {
//       userId: payload.userId,
//       message: payload.message,
//     };
//   } catch (error: any) {
//     throw new Error(error.response?.data?.error?.message || 'Failed to update user');
//   }
// };

export const softDeleteUser = async (userId: string): Promise<{ userId: string; message: string }> => {
  try {
    const response = await adminAxiosInstance.delete<GenericResponse<any>>(`/admin/users/soft-delete`, {
      params: { userId: userId }
    });
    const payload = response.data.payload;
    return {
      userId: payload.userId,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to delete user');
  }
};

export const verifyUser = async (userId: string): Promise<{ userId: string; message: string }> => {
  try {
    const response = await adminAxiosInstance.post<GenericResponse<any>>(`/admin/users/verify`, null, {
      params: { userId: userId }
    });
    const payload = response.data.payload;
    return {
      userId: payload.userId,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to verify user');
  }
};

export const unverifyUser = async (userId: string): Promise<{ userId: string; message: string }> => {
  try {
    const response = await adminAxiosInstance.post<GenericResponse<any>>(`/admin/users/unverify`, null, {
      params: { userId: userId }
    });
    const payload = response.data.payload;
    return {
      userId: payload.userId,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to unverify user');
  }
};

export const banUser = async (banData: any): Promise<{ userId: string; banId: string; message: string }> => {
  try {
    const response = await adminAxiosInstance.post<GenericResponse<any>>(`/admin/users/ban`, banData);
    const payload = response.data.payload;
    return {
      userId: payload.userId,
      banId: payload.ban_id,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to ban user');
  }
};

export const unbanUser = async (userId: string): Promise<{ userId: string; message: string }> => {
  try {
    const response = await adminAxiosInstance.post<GenericResponse<any>>(`/admin/users/unban`, null, {
      params: { userId: userId }
    });
    const payload = response.data.payload;
    return {
      userId: payload.userId,
      message: payload.message,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to unban user');
  }
};

export const getBanHistory = async (userId: string): Promise<{ bans: Array<any>; message: string }> => {
  try {
    const response = await adminAxiosInstance.get<GenericResponse<any>>(`/admin/users/ban-history`, {
      params: { userId: userId }
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
