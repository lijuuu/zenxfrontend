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
const baseURL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000'}/api/v1`;


const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});


//request interceptor with separated logic for user/admin tokens
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const requiresAuthHeader = config.headers['X-Requires-Auth'];
    const isAdminHeader = config.headers['X-Admin'];

    const requiresAuth = requiresAuthHeader !== 'false';
    const isAdmin = isAdminHeader === 'true';

    if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers);
    }

    if (requiresAuth) {
      const userToken = Cookies.get('accessToken');
      const adminToken = Cookies.get('adminAccessToken');

      if (isAdmin && adminToken) {
        config.headers.set('Authorization', `Bearer ${adminToken}`);
      }

      if (!isAdmin && userToken) {
        config.headers.set('Authorization', `Bearer ${userToken}`);
      }
    }

    config.headers.delete('X-Requires-Auth');
    config.headers.delete('X-Admin');

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
      throw new Error('please login');
    }

    const response = await axios.post(`${baseURL}/auth/token/refresh`, { refreshToken });
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
    localStorage.removeItem("userid");
    throw error;
  }
}

//response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const requiresAuth = originalRequest.headers['X-Requires-Auth'] !== 'false';

    console.log("error in interceptor ", error)

    if (requiresAuth && error?.response?.data?.error?.type != "ERR_LOGIN_NOT_VERIFIED" && error.response?.status === 401 && !originalRequest._retry) {
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

        // if (window.location.pathname !== '/login') {
        //   window.location.href = '/login';
        // }

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