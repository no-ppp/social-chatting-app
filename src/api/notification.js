import { axiosInstance } from './auth.js';

export const notificationAPI = {
    async getNotifications() {
        try {
            const response = await axiosInstance.get('/notifications/');
            return response.data;
        } catch (error) {
            console.error('Get notifications error', error);
            throw error;
        }
    },
    async markAsReaded(notificationId) {
        try {
            const response = await axiosInstance.post(`/notifications/${notificationId}/mark-as-read/`);
            return response.data;
        } catch (error) {
            console.error('Mark as readed error', error);
            throw error;
        }
    },
    async markAllAsReaded() {
        try {
            const response = await axiosInstance.post('/notifications/mark-all-as-read/');
            return response.data;
        } catch (error) {
            console.error('Mark all as readed error', error);
            throw error;
        }
    },
    async deleteNotification(notificationId) {
        try {
            const resposne = await axiosInstance.delete(`/notifications/${notificationId}/`);
            return resposne.data;
        } catch (error) {
            console.error('Delete notification error', error);
            throw error;
        }
    }
}

export default notificationAPI;