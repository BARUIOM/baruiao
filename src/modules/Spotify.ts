import Axios from 'axios';
import { ref } from 'vue';

import {
    AuthStore,
    TokenRefresherFunction,
    TokenValidatorFunction,
} from './AuthStore';
import { Baruio } from './Baruio';

const axios = Axios.create({
    baseURL: 'https://api.spotify.com/v1',
    validateStatus: () => true,
});

axios.interceptors.request.use((config) => {
    if (!config.headers)
        config.headers = {};

    if (!config.headers['Authorization']) {
        const credentials = Spotify.auth.getCredentials();

        if (credentials) {
            const { accessToken } = credentials;
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }

    return config;
});

axios.interceptors.response.use((response) => {
    if (response.status === 401) {
        return Spotify.auth.refresh()
            .then(() => Spotify.auth.getCredentials())
            .then(credentials => {
                if (!credentials)
                    throw new Error('Unable to refresh Spotify access token');

                if (!response.config.headers)
                    response.config.headers = {};

                const { accessToken } = credentials;
                response.config.headers['Authorization'] = `Bearer ${accessToken}`;

                return Axios.request(response.config);
            });
    }

    return response;
});

const validator: TokenValidatorFunction = async (accessToken: string) => {
    const response = await axios.get<SpotifyApi.UserProfileResponse>('/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return response.status === 200 && !!response.data.id;
};

const refresher: TokenRefresherFunction = (refreshToken: string) => {
    return Baruio.refreshOAuthCredentials('spotify', refreshToken)
        .then(({ accessToken }) => accessToken);
};

export namespace Spotify {

    export const auth = new AuthStore('spotify', validator, refresher);

}
