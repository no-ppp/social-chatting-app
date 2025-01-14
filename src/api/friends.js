import { axiosInstance } from './auth.js';

export const friendsAPI = {
    async getFriends(userId) {
        try {
            console.log('Fetching friends for userId:', userId);
            
            if (!userId) {
                throw new Error('User ID is required');
            }

            const response = await axiosInstance.get(`/users/${userId}/friends/`);
            console.log('Friends API response:', response);
            return response.data;

        } catch (error) {
            console.error('Get friends error:', error);
            throw error;
        }
    },

    async getAllUsers() {
        try {
            const response = await axiosInstance.get('/users/');
            return response.data;
        } catch (error) {
            console.error('Get all users error:', error);
            throw error;
        }
    },

    async sendFriendRequest(userId) {
        try {
            console.log('Sending friend request to userId:', userId);
            const response = await axiosInstance.post(`/users/${userId}/send-friend-request/`);
            console.log('Send friend request response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Send friend request error:', error);
            throw error;
        }
    },

    async acceptFriendRequest(requestId) {
        try {
            const response = await axiosInstance.post(`/users/${requestId}/accept-friend-request/`);
            return response.data;
        } catch (error) {
            console.error('Accept friend request error:', error);
            throw error;
        }
    },

    async rejectFriendRequest(requestId) {
        try {
            const response = await axiosInstance.post(`/friend-requests/${requestId}/reject/`);
            return response.data;
        } catch (error) {
            console.error('Reject friend request error:', error);
            throw error;
        }
    },

    async getFriendRequests() {
        try {
            const response = await axiosInstance.get('/notifications/');
            return response.data;
        } catch (error) {
            console.error('Get friend requests error:', error);
            throw error;
        }
    },

    async removeFriend(userId) {
        try {
            const response = await axiosInstance.delete(`/friends/${userId}/`);
            return response.data;
        } catch (error) {
            console.error('Remove friend error:', error);
            throw error;
        }
    },
    async getPendingFriendRequests() {
        try {
            const response = await axiosInstance.get('/users/pending-requests/');
            return response.data;
        } catch (error) {
            console.error('Get pending friend requests error:', error);
            throw error;
        }
    },
    async deleteFriendRequest(userId) {
        try {
            const response = await axiosInstance.post(`/users/${userId}/remove-friend/`);
            return response.data;
        } catch (error) {
            console.error('Delete friend request error:', error);
            throw error;
        }
    }
};

export default friendsAPI; 