// frontend/src/services/authServices.js
import api from './api'; // your generic api function

export const register = async (userData) => {
  const response = await api('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  return response;
};

export const login = async (credentials) => {
  const response = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  return response;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const getCurrentUser = async () => {
  const response = await api('/auth/me');
  return response.user;
};

export const updateProfile = async (profileData) => {
  return api('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

export const requestPasswordReset = async (email) => {
  return api('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (token, newPassword) => {
  return api('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
};