import Axios from 'axios';

import {
    AuthStore,
    Credentials,
    TokenValidatorFunction,
    TokenRefresherFunction,
} from './AuthStore';

type OAuthProvider = 'spotify';

export type SessionState = {
    name: string;
    [key: string]: string;
};

const BARUIO_AUTH_API_URL = import.meta.env['VITE_BARUIO_AUTH_API_URL'];

const axios = Axios.create({
    baseURL: BARUIO_AUTH_API_URL,
    validateStatus: () => true,
});

const validator: TokenValidatorFunction = async (accessToken: string) => {
    const response = await axios.get('/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    });

    return response.status === 200;
};

const refresher: TokenRefresherFunction = async (refreshToken: string) => {
    const response = await axios.post<Credentials>('/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    });

    if (response.status !== 200)
        throw new Error('Error refreshing user token');

    const { accessToken } = response.data;
    return accessToken;
};

export namespace Baruio {

    export const auth = new AuthStore('user', validator, refresher);

    export async function signIn(email: string, password: string): Promise<void> {
        const response = await axios.post<Credentials>(
            '/sign-in', { email, password }
        );

        if (response.status !== 200)
            throw new Error('Error signing in with email and password');

        const { accessToken, refreshToken } = response.data;
        auth.setCredentials({ accessToken, refreshToken });
    }

    export function getOAuthURL(provider: OAuthProvider): string {
        return BARUIO_AUTH_API_URL + '/oauth/' + provider;
    }

    export async function getOAuthCredentials(provider: OAuthProvider, code: string): Promise<Credentials> {
        const response = await axios.post<Credentials>(`/oauth/${provider}/token`, {
            grant_type: 'authorization_code', code
        });

        if (response.status !== 200)
            throw new Error('Error exchanging Spotify credentials');

        return response.data;
    }

    export async function refreshOAuthCredentials(provider: OAuthProvider, refreshToken: string): Promise<Credentials> {
        const response = await axios.post<Credentials>(`/oauth/${provider}/token`, {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        });

        if (response.status !== 200)
            throw new Error('Error refreshing access token');

        return response.data;
    }

    export function getState(): SessionState | null {
        const state = sessionStorage.getItem('state');

        if (state)
            return JSON.parse(state);

        return null;
    }

    export function setState(name: string, params: Record<string, string>): void {
        const state: SessionState = { name, ...params };
        sessionStorage.setItem('state', JSON.stringify(state));
    }

    export function clearState(): void {
        sessionStorage.removeItem('state');
    }

}
