const API_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No access token found');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

export const usersAPI = {
  async getAllUsers() {
    try {
      const response = await fetch(`${API_URL}/users/`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        // Token wygasł lub jest nieprawidłowy
        localStorage.removeItem('access_token');
        throw new Error('Session expired. Please log in again.');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch users');
      }

      return data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        throw new Error('Session expired. Please log in again.');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch user');
      }

      return data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  async searchUsers(query) {
    try {
      console.log('Current token:', localStorage.getItem('access_token')); // Debug

      const response = await fetch(`${API_URL}/users/?search=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        throw new Error('Session expired. Please log in again.');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to search users');
      }

      return data;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }
}; 