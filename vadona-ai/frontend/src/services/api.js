import axios from 'axios';

// Ensure all API endpoints are correctly pointing to the backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error handling for API responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., token expiration)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password })
};

export const chatService = {
  createChat: (title) => api.post('/chat', { title }),
  getChats: () => api.get('/chat'),
  getChat: (chatId) => api.get(`/chat/${chatId}`),
  sendMessage: (chatId, message) =>
    api.post(`/chat/${chatId}/message`, { message }),
  deleteChat: (chatId) => api.delete(`/chat/${chatId}`)
};

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data)
};

export default api;
