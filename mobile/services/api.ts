import axios from 'axios';
import { storage } from '../utils/storage';
import { Platform } from 'react-native';

// For Android emulator to access local server, we use 10.0.2.2
// For iOS simulator, localhost works
const BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api'
    : 'http://localhost:8000/api'
  : 'https://api.inkspire.com/api'; // Production URL

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Here you would implement your refresh token logic
        // Example: const response = await axios.post(`${BASE_URL}/auth/refresh`);
        // await storage.setItem('accessToken', response.data.token);
        // originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
        // return api(originalRequest);
        
        // If refresh fails, you would logout the user
        // useAuthStore.getState().logout();
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    // Handle Network Errors
    if (!error.response) {
      console.error('Network Error: Please check your internet connection.');
    }
    
    return Promise.reject(error);
  }
);
