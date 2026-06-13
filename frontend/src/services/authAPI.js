import api from './api';

export const register = (userData) => api('/auth/register', {
  method: 'POST',
  body: JSON.stringify(userData),
});

export const login = (credentials) => api('/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
});

export const getCurrentUser = () => api('/auth/me');