// adminApi.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { GenericResponse, LoginCredentials, LoginResponse, UsersResponse } from '@/api/types';

const API_BASE_URL = 'http://localhost:7000';

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

export const getAllUsers = async (): Promise<UsersResponse> => {
  try {
    const response = await axios.get<GenericResponse<any>>(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    });
    const payload = response.data.payload;
    return {
      users: payload.users,
      totalCount: payload.totalCount,
      nextPageToken: payload.nextPageToken,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch users');
  }
};