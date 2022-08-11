import Axios from 'axios';

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
