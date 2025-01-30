// src/lib/axios.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default apiClient;