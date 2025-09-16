import { defineStore } from 'pinia';
import api from '../api';
import router from '../router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        userRole: (state) => state.user?.role,
    },
    actions: {
        async login(credentials) {
            const response = await api.login(credentials);
            const { access_token, user } = response.data;
            this.token = access_token;
            this.user = user;
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            await router.push('/app/dashboard');
        },
        async logout() {
            try {
                if (this.token) await api.logout();
            } finally {
                this.user = null;
                this.token = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                await router.push('/login');
            }
        },
    },
});