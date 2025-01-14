import { axiosInstance } from './auth.js';

export const usersAPI = {
  async getAllUsers() {
    try {
      const response = await axiosInstance.get('/users/');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        throw new Error('Session expired. Please log in again.');
      }
      console.error('Get users error:', error);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const response = await axiosInstance.get(`/users/${userId}/`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        throw new Error('Session expired. Please log in again.');
      }
      console.error('Get user error:', error);
      throw error;
    }
  },

  async searchUsers(query) {
    try {
      const response = await axiosInstance.get('/users/', {
        params: { search: query }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        throw new Error('Session expired. Please log in again.');
      }
      console.error('Search users error:', error);
      throw error;
    }
  }
}; 