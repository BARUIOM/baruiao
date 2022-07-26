import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Home,
        beforeEnter: (to, from, next) => {
            next({ name: 'login' });
        },
        children: [],
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
