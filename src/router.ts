import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';

import { Baruio } from '@/modules/Baruio';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Home,
        beforeEnter: async (to, from, next) => {
            const isAuthenticated = await Baruio.authenticate();

            if (!isAuthenticated)
                return next({ name: 'login' });

            return next();
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
