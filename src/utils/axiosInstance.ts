import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import Cookies from 'js-cookie';

// define custom config interface to include requiresAuth
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  requiresAuth?: boolean;
  _retry?: boolean;
}

// use baseURL from environment variables or fallback to a default
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api/v1';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

// request interceptor with conditional token addition
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // default to requiring auth unless explicitly set to false
    const requiresAuth = config.requiresAuth !== false;

    // ensure headers is an AxiosHeaders instance
    if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers);
    }

    if (requiresAuth) {
      const token = Cookies.get('accessToken');
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // remove requiresAuth from headers before sending
    config.headers.delete('requiresAuth');

    return config;
  },
  (error) => {
    console.error('request interceptor error:', error);
    return Promise.reject(error);
  }
);

// function to refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      throw new Error('no refresh token available');
    }
    
    const response = await axios.post(`${baseURL}/auth/refresh`, {
      refreshToken,
    });
    
    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.payload;
    
    // set the new tokens
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
  } catch (error) {
    // clear cookies on refresh failure
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    throw error;
  }
};

// response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    // only attempt token refresh for requests that require auth
    if (originalRequest.requiresAuth !== false && 
        error.response?.status === 401 && 
        !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        
        // ensure headers is an AxiosHeaders instance
        if (!(originalRequest.headers instanceof AxiosHeaders)) {
          originalRequest.headers = new AxiosHeaders(originalRequest.headers);
        }
        
        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('token refresh failed:', refreshError);
        
        // redirect to login if token refresh fails
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