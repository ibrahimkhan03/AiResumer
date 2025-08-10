import axios from 'axios';
import { API_BASE_URL } from './auth';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      // Token will be added by the component using useAuth() hook
      // This is handled at the component level now
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to sign in
      window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }
);

// API functions
export const authApi = {
  getCurrentUser: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/auth/me', config);
  },
  updateProfile: (data: { name?: string; plan?: string }, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.put('/auth/profile', data, config);
  },
  deleteAccount: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.delete('/auth/account', config);
  },
  getUserStats: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/auth/stats', config);
  },
};

// Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  plan: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  user?: T;
  message?: string;
  error?: string;
}

export default api;