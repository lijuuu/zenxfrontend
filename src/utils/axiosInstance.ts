
import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:7000/api/v1',
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      const headers: any = config.headers || {};
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Function to refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axios.post('http://localhost:7000/api/v1/auth/refresh', {
      refreshToken,
    });
    
    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.payload;
    
    // Set the new tokens
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
    // Clear cookies on refresh failure
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    throw error;
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 Unauthorized and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Redirect to login if token refresh fails
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    if (error.isAxiosError) {
      console.error('Axios Response Error:', error.message);
    } else {
      console.error('Unexpected Response Error:', error);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
