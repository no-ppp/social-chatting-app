const API_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const friendsAPI = {
    async sendFriendRequest(id) {
        try {
            const response = await fetch(`${API_URL}/users/${id}/send_friend_request/`, {
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

    async acceptFriendRequest(requestId) {
        try {
            const response = await fetch(`${API_URL}/accept_friend/${requestId}/`, {
                method: 'POST',
                headers: getAuthHeaders()
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
                headers: getAuthHeaders()
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
                headers: getAuthHeaders()
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