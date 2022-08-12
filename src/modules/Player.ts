import Axios from 'axios';
import { ref, toRef, unref } from 'vue';

import { Baruio } from './Baruio';

const BARUIO_STREAM_SERVER = import.meta.env['VITE_BARUIO_STREAM_SERVER'];

const axios = Axios.create({
    baseURL: BARUIO_STREAM_SERVER
});

axios.interceptors.request.use(async config => {
    if (!config.headers)
        config.headers = {};

    if (!config.headers['Authorization']) {
        const credentials = Baruio.auth.getCredentials();

        if (credentials) {
            const { accessToken } = credentials;
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }

    return config;
});

const audio = new Audio();
const _currentTime = ref<number>(0);

audio.ontimeupdate = () => {
    _currentTime.value = audio.currentTime;
};

const props = {
    get currentTime(): number {
        return unref(_currentTime);
    },
    set currentTime(value: number) {
        audio.currentTime = value;
    },
};

export const currentTrack = ref<SpotifyApi.TrackObjectFull>();
export const currentTime = toRef(props, 'currentTime');

export namespace Player {

    export async function load(track: SpotifyApi.TrackObjectFull) {
        const response = await axios.get(`/play/${track.id}`);
        const { token } = response.data;

        audio.src = BARUIO_STREAM_SERVER + '/stream?token=' + token;
        audio.load();

        currentTrack.value = track;
    }

    export async function play() {
        await audio.play();
    }

    export function pause() {
        audio.pause();
    }

}
