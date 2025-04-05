import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import Cookies from 'js-cookie';

//define custom config interface to include requiresauth
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  headers: AxiosHeaders & {
    'X-Requires-Auth'?: string;
  };
  _retry?: boolean;
}

//use baseurl from environment variables or fallback to default
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api/v1';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

//request interceptor with conditional token addition
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const requiresAuth = config.headers['X-Requires-Auth'] !== 'false';

    if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers);
    }

    if (requiresAuth) {
      const token = Cookies.get('accessToken');
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }

    config.headers.delete('X-Requires-Auth');
    return config;
  },
  (error) => {
    console.error('request interceptor error:', error);
    return Promise.reject(error);
  }
);

//function to refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      throw new Error('no refresh token available');
    }

    const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.payload;

    Cookies.set('accessToken', accessToken, {
      expires: expiresIn / (24 * 60 * 60),
      secure: true,
      sameSite: 'Strict',
    });

    Cookies.set('refreshToken', newRefreshToken, {
      expires: 7,
      secure: true,
      sameSite: 'Strict',
    });

    return accessToken;
  } 
  catch (error) {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    throw error;
  }
};

//response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const requiresAuth = originalRequest.headers['X-Requires-Auth'] !== 'false';

    if (requiresAuth && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();

        if (!(originalRequest.headers instanceof AxiosHeaders)) {
          originalRequest.headers = new AxiosHeaders(originalRequest.headers);
        }

        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('token refresh failed:', refreshError);

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    if (error.isAxiosError) {
      console.error('axios response error:', error.message);
    } else {
      console.error('unexpected response error:', error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;