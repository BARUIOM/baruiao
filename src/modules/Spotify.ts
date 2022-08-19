import Axios, { AxiosRequestConfig } from 'axios';
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

const request = async <T>(options: AxiosRequestConfig = {}, next?: string): Promise<T> => {
    if (next) {
        options.method = 'GET';
        options.url = next;
    }

    const response = await axios.request<T>(options);

    if (response.status === 200)
        return response.data;

    return {} as T;
};

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

type PageableRequestOptions = {
    limit?: number;
    offset?: number;
    next?: string;
};

export class Collection<T> {

    private readonly ref = ref<T[]>([]) as Ref<T[]>;
    private readonly loaded = ref<boolean>(false);

    private _next: string | null = null;

    constructor(
        private readonly fetch: (options?: PageableRequestOptions) => Promise<Pageable<T>>
    ) { }

    get items(): T[] {
        return unref(this.ref);
    }

    public async load(): Promise<void> {
        if (this.loaded.value)
            return;

        return this.fetch()
            .then(({ items, next }) => {
                this.ref.value = items;
                this._next = next;
            })
            .finally(() => {
                this.loaded.value = true;
            });
    }

    public async next(): Promise<boolean> {
        const next = this._next;

        if (!next)
            return false;

        return this.fetch({ next })
            .then(({ items, next }) => {
                this.ref.value = [...this.ref.value, ...items];
                this._next = next;

                return !!next;
            })
            .catch(() => false);
    }

}

export namespace Spotify {

    export const auth = new AuthStore('spotify', validator, refresher);

    export async function getSavedAlbums({ limit = 20, offset = 0, next: _next }: PageableRequestOptions = {})
        : Promise<Pageable<SpotifyApi.SavedAlbumObject>> {
        const data = await request<SpotifyApi.UsersSavedAlbumsResponse>({
            method: 'GET',
            url: '/me/albums',
            params: { limit, offset },
        }, _next);

        const { items = [], next = null } = data;

        return { items, next };
    }

    export async function getSavedTracks({ limit = 20, offset = 0, next: _next }: PageableRequestOptions = {})
        : Promise<Pageable<SpotifyApi.SavedTrackObject>> {
        const data = await request<SpotifyApi.UsersSavedTracksResponse>({
            method: 'GET',
            url: '/me/tracks',
            params: { limit, offset },
        }, _next);

        const { items = [], next = null } = data;

        return { items, next };
    }

    export async function getSavedArtists({ limit = 20, next: _next }: PageableRequestOptions = {})
        : Promise<Pageable<SpotifyApi.ArtistObjectFull>> {
        const data = await request<SpotifyApi.UsersFollowedArtistsResponse>({
            method: 'GET',
            url: '/me/following',
            params: { limit, type: 'artist' },
        }, _next);

        const { artists = {} as typeof data['artists'] } = data;
        const { items = [], next = null } = artists;

        return { items, next };
    }

    export async function getSavedPlaylists({ limit = 20, offset = 0, next: _next }: PageableRequestOptions = {})
        : Promise<Pageable<SpotifyApi.PlaylistObjectSimplified>> {
        const data = await request<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>({
            method: 'GET',
            url: '/me/playlists',
            params: { limit, offset },
        });

        const { items = [], next = null } = data;

        return { items, next };
    }

    export function getPlaylist(playlistId: string) {
        return request<SpotifyApi.SinglePlaylistResponse>({
            method: 'GET',
            url: '/playlists/' + playlistId,
        });
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
