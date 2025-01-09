const API_URL = 'http://127.0.0.1:8000/api';

export const friendsAPI = {
  async sendFriendRequest(userId) {
    try {
      const response = await fetch(`${API_URL}/send_friend_request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ receiver_id: userId })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send friend request');
      }

      return data;
    } catch (error) {
      console.error('Send friend request error:', error);
      throw error;
    }
  },

  async acceptFriendRequest(requestId) {
    try {
      const response = await fetch(`${API_URL}/accept_friend/${requestId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to accept friend request');
      }

      return data;
    } catch (error) {
      console.error('Accept friend request error:', error);
      throw error;
    }
  },

  async rejectFriendRequest(requestId) {
    try {
      const response = await fetch(`${API_URL}/reject_friend/${requestId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to reject friend request');
      }

      return data;
    } catch (error) {
      console.error('Reject friend request error:', error);
      throw error;
    }
  },

  async getFriendRequests() {
    try {
      const response = await fetch(`${API_URL}/friend_requests/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to get friend requests');
      }

      return data;
    } catch (error) {
      console.error('Get friend requests error:', error);
      throw error;
    }
  }
}; 