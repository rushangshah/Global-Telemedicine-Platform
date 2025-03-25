import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/auth/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/auth/Register.vue')
    },
    {
        path: '/appointments',
        name: 'appointments',
        component: () => import('../views/appointments/Index.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/medical-records',
        name: 'medical-records',
        component: () => import('../views/medical-records/Index.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/prescriptions',
        name: 'prescriptions',
        component: () => import('../views/prescriptions/Index.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/consultations',
        name: 'consultations',
        component: () => import('../views/consultations/Index.vue'),
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token');
    
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;
