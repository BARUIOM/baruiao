import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import OAuth from '@/views/OAuth.vue';

import { Baruio } from '@/modules/Baruio';
import { Spotify } from '@/modules/Spotify';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Home,
        beforeEnter: async (to, from, next) => {
            const isAuthenticated = await Baruio.auth.validate()
                .catch((e) => false);

            if (!isAuthenticated)
                return next({ name: 'login' });

            const isSpotifyConnected = await Spotify.auth.validate();

            if (!isSpotifyConnected) {
                const provider = 'spotify';

                return next({ name: 'oauth', params: { provider } });
            }

            return next();
        },
        children: [
            {
                path: '',
                name: 'userLibrary',
                component: () => import('@/views/UserLibrary.vue'),
            },
            {
                path: 'collection/albums',
                name: 'albumCollection',
                component: () => import('@/views/collection/Albums.vue'),
            },
            {
                path: 'collection/artists',
                name: 'artistCollection',
                component: () => import('@/views/collection/Artists.vue'),
            },
            {
                path: 'collection/playlists',
                name: 'playlistCollection',
                component: () => import('@/views/collection/Playlists.vue'),
            },
            {
                path: 'collection/tracks',
                name: 'trackCollection',
                component: () => import('@/views/collection/Tracks.vue'),
            },
        ],
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
    },
    {
        name: 'oauth',
        path: '/oauth',
        component: OAuth,
        beforeEnter: (to, from, next) => {
            const { provider } = to.params;
            if (typeof provider === 'string' && provider.length)
                return next();

            const state = Baruio.getState();
            if (state && state.name === 'oauth' && 'provider' in state)
                return next();

            return next({ name: 'login' });
        },
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
