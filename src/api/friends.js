const API_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
        throw new Error('No access token found');
    }

    return {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
};

export const friendsAPI = {
    async getFriendRequests() {
        try {
            const response = await fetch(`${API_URL}/notifications/`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Get friend requests error:', error);
            throw error;
        }
    },

    async acceptFriendRequest(userId) {
        try {
            const response = await fetch(`${API_URL}/users/${userId}/accept-friend-request/`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to accept friend request');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Accept friend request error:', error);
            throw error;
        }
    },

    async rejectFriendRequest(userId) {
        try {
            const response = await fetch(`${API_URL}/users/${userId}/reject-friend-request/`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to reject friend request');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Reject friend request error:', error);
            throw error;
        }
    },

    async sendFriendRequest(id) {
        try {
            const response = await fetch(`${API_URL}/users/${id}/send-friend-request/`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (response.status === 200) {
                return data;
            }

            throw new Error(data.error || 'Błąd wysyłania zaproszenia');
        } catch (error) {
            console.error('Send friend request error:', error);
            throw error;
        }
    },
    async markAsReaded(notificationId) {
        try {
           const response = await fetch(`${API_URL}/notifications/${notificationId}/mark-read/`, {
            method: 'POST',
            headers: getAuthHeaders()
           })

           if (!response.ok) {
            throw new Error('Failed to mark as readed');
           }

           const data = await response.json();
           return data;
        } catch (error) {
          console.error('Mark as readed error:', error);
          throw error;
        }

    },
    async retriveUser(notificationId) {
      try {
        const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
          method: 'GET',
          headers: getAuthHeaders()
        })

        if (!response.ok) {
          throw new Error('Failed to retrive user');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Retrive user error:', error);
        throw error;
      }
    },
    async getFriendRequest(userId) {
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                throw new Error('No access token found');
            }

            const response = await fetch(`${API_URL}/users/${userId}/friend-request/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Get friend request error:', error);
            return null;
        }
    },
    async getFriends(userId) {
        try {
            const response = await fetch(`${API_URL}/users/${userId}/friends/`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                throw new Error('Failed to get friends');
            }
            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Get friends error:', error);
            throw error;
        }
    }
}; 