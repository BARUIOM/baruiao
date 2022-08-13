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
const _playerState = ref<Player.State>(0);
const _currentTime = ref<number>(0);

audio.onpause = () => {
    _playerState.value = Player.State.PAUSED;
};

audio.onplay = () => {
    _playerState.value = Player.State.PLAYING;
};

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
    get playerState(): Player.State {
        return unref(_playerState);
    },
    set playerState(value: Player.State) {
        if (value === Player.State.PAUSED)
            audio.pause();
        if (value === Player.State.PLAYING)
            audio.play();
    },
};

export const currentTrack = ref<SpotifyApi.TrackObjectFull>();
export const currentTime = toRef(props, 'currentTime');

export const playerState = toRef(props, 'playerState');
export const repeatState = ref<Player.RepeatState>(0);
export const shuffleState = ref<Player.ShuffleState>(0);

namespace Player {

    export enum State {
        PAUSED = 0,
        PLAYING = 1,
    }

    export enum RepeatState {
        REPEAT_OFF = 0,
        REPEAT_ALL = 1,
        REPEAT_ONCE = 2,
    }

    export enum ShuffleState {
        SHUFFLE_OFF = 0,
        SHUFFLE_ON = 1,
    }

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

export default Player;
