import axios from 'axios';
import { useAuthStore } from './stores/auth';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use(config => {
    const authStore = useAuthStore();
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
}, error => Promise.reject(error));

export default {
    login(credentials) { return apiClient.post('/login', credentials); },
    logout() { return apiClient.post('/logout'); },
    getPlans(params = {}) { return apiClient.get('/plans', { params }); },
    getPlan(id) { return apiClient.get(`/plans/${id}`); },
    createPlan(planData) { return apiClient.post('/plans', planData); },
    updatePlan(id, planData) { return apiClient.put(`/plans/${id}`, planData); },
    deletePlan(id) { return apiClient.delete(`/plans/${id}`); },
    approvePlan(planId) { return apiClient.post(`/plans/${planId}/approve`); },
    rejectPlan(planId) { return apiClient.post(`/plans/${planId}/reject`); },
    getOrders() { return apiClient.get('/orders'); },
    getOrder(orderId) { return apiClient.get(`/orders/${orderId}`); },
    updateOrderStatus(orderId, statusData) { return apiClient.patch(`/orders/${orderId}/status`, statusData); },
    getNotifications() { return apiClient.get('/notifications'); },
    markNotificationAsRead(notificationId) { return apiClient.post(`/notifications/${notificationId}/read`); },
    getProducts() { return apiClient.get('/products'); }
};