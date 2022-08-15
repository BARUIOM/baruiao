import Axios from 'axios';
import { ref, Ref, unref } from 'vue';

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

type Pageable<T> = {
    items: T[];
    next: string | null;
};

class Collection<T> {

    private readonly ref = ref<T[]>([]) as Ref<T[]>;
    private readonly loaded = ref<boolean>(false);

    private _next: string | null = null;

    constructor(
        private readonly callback: () => Promise<Pageable<T>>
    ) { }

    get items(): T[] {
        return unref(this.ref);
    }

    public async load(): Promise<void> {
        if (this.loaded.value)
            return;

        await Promise.resolve(this.callback())
            .then(({ items, next }) => {
                this.ref.value = items;
                this._next = next;
            })
            .then(() =>
                this.loaded.value = true
            );
    }

    public async next(): Promise<boolean> {
        if (!this._next)
            return false;

        const response = await axios.get<SpotifyApi.PagingObject<T>>(this._next);

        if (response.status === 200) {
            const { items, next } = response.data;

            this.ref.value = [...this.ref.value, ...items];
            this._next = next;

            return !!next;
        }

        return false;
    }

}

export namespace Spotify {

    export const auth = new AuthStore('spotify', validator, refresher);

    export async function getSavedAlbums(limit: number = 20, offset: number = 0)
        : Promise<Pageable<SpotifyApi.SavedAlbumObject>> {
        const response = await axios.get<SpotifyApi.UsersSavedAlbumsResponse>('/me/albums', {
            params: { limit, offset },
        });

        if (response.status === 200) {
            const { items, next } = response.data;

            return { items, next };
        }

        return { items: [], next: null };
    }

    export async function getSavedTracks(limit: number = 20, offset: number = 0)
        : Promise<Pageable<SpotifyApi.SavedTrackObject>> {
        const response = await axios.get<SpotifyApi.UsersSavedTracksResponse>('/me/tracks', {
            params: { limit, offset },
        });

        if (response.status === 200) {
            const { items, next } = response.data;

            return { items, next };
        }

        return { items: [], next: null };
    }

    export async function getSavedArtists(limit: number = 20) {
        const response = await axios.get<SpotifyApi.UsersFollowedArtistsResponse>('/me/following', {
            params: { limit, type: 'artist' },
        });

        if (response.status === 200) {
            const { artists } = response.data;
            const { items, next } = artists;

            return { items, next };
        }

        return { items: [], next: null };
    }

    export async function getSavedPlaylists(limit: number = 20, offset: number = 0) {
        const response = await axios.get<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>('/me/playlists', {
            params: { limit, offset },
        });

        if (response.status === 200) {
            const { items, next } = response.data;

            return { items, next };
        }

        return { items: [], next: null };
    }

}

const userSavedAlbums = new Collection<SpotifyApi.SavedAlbumObject>(Spotify.getSavedAlbums);
const userSavedArtists = new Collection<SpotifyApi.ArtistObjectFull>(Spotify.getSavedArtists);
const userSavedPlaylists = new Collection<SpotifyApi.PlaylistObjectSimplified>(Spotify.getSavedPlaylists);
const userSavedTracks = new Collection<SpotifyApi.SavedTrackObject>(Spotify.getSavedTracks);

export const useSpotify = () => {
    return {
        userSavedAlbums,
        userSavedArtists,
        userSavedPlaylists,
        userSavedTracks
    };
};
