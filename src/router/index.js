import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import AppLayout from '../components/AppLayout.vue';
import LandingPage from '../views/LandingPage.vue'; 
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import ManagerPpicApproval from '../views/manager/ManagerPpicApproval.vue';
import PpicDashboard from '../views/ppic/PpicDashboard.vue';
import PpicLogs from '../views/ppic/PpicLogs.vue';
import ProduksiDashboard from '../views/produksi/ProduksiDashboard.vue';
import ProduksiLogs from '../views/produksi/ProduksiLogs.vue';

const routes = [
    { path: '/', name: 'Landing', component: LandingPage },
    { path: '/login', name: 'Login', component: Login, meta: { guest: true } },

    // Perlu login
    {
        path: '/app', 
        component: AppLayout,
        meta: { requiresAuth: true },
        redirect: '/app/dashboard', 
        children: [
            { path: 'dashboard', name: 'Dashboard', component: Dashboard },
            { 
              path: 'manager/ppic-approval', 
              name: 'ManagerPpicApproval', 
              component: ManagerPpicApproval,
              meta: { roles: ['manager'] }
            },
            { 
              path: 'ppic', 
              name: 'PpicDashboard', 
              component: PpicDashboard,
              meta: { roles: ['staff_ppic'] }
            },
            { 
              path: 'ppic/logs', 
              name: 'PpicLogs', 
              component: PpicLogs,
              meta: { roles: ['staff_ppic', 'manager'] }
            },
            { 
              path: 'produksi', 
              name: 'ProduksiDashboard', 
              component: ProduksiDashboard,
              meta: { roles: ['staff_produksi', 'manager'] }
            },
            { 
              path: 'produksi/logs', 
              name: 'ProduksiLogs', 
              component: ProduksiLogs,
              meta: { roles: ['staff_produksi', 'manager'] }
            },
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next('/login');
    }
    if (to.meta.guest && authStore.isAuthenticated) {
        return next('/app/dashboard');
    }
    if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
        return next('/app/dashboard');
    }

    next();
});

export default router;