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


const adminAxiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

//request interceptor with conditional token addition
adminAxiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const requiresAuth = config.headers['X-Requires-Auth'] !== 'false';

    if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers);
    }

    if (requiresAuth) {
      const token = Cookies.get('adminAccessToken');
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


export default adminAxiosInstance;