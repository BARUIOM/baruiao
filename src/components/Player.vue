<script lang="ts" setup>
import { Forms } from '@/components/forms';

import Player, {
    currentTime,
    currentTrack,
    playerState,
    repeatState,
    shuffleState,
} from '@/modules/Player';

const REPEAT_BUTTON_ICON = {
    [Player.RepeatState.REPEAT_OFF]: 'repeat',
    [Player.RepeatState.REPEAT_ALL]: 'repeat',
    [Player.RepeatState.REPEAT_ONCE]: 'repeat_one',
};

const REPEAT_BUTTON_COLOR = {
    [Player.RepeatState.REPEAT_OFF]: 'white',
    [Player.RepeatState.REPEAT_ALL]: 'primary',
    [Player.RepeatState.REPEAT_ONCE]: 'primary',
};

const SHUFFLE_BUTTON_COLOR = {
    [Player.ShuffleState.SHUFFLE_OFF]: 'white',
    [Player.ShuffleState.SHUFFLE_ON]: 'primary',
};

const STATE_BUTTON_ICON = {
    [Player.State.PAUSED]: 'play_arrow',
    [Player.State.PLAYING]: 'pause',
};

const toggleRepeat = () => {
    const nextState = repeatState.value + 1;

    if (Player.RepeatState[nextState])
        repeatState.value = nextState;
    else
        repeatState.value = Player.RepeatState.REPEAT_OFF;
};

const toggleShuffle = () =>
    shuffleState.value = +!shuffleState.value;

const toggleState = () =>
    playerState.value = +!playerState.value;
</script>

<template>
    <div class="player" v-if="currentTrack">
        <div>
            <img :src="currentTrack.album.images[1].url" />
            <div>
                <div>{{ currentTrack.name }}</div>
                <div class="text-sm text-neutral-400">{{ currentTrack.artists[0].name }}</div>
            </div>
        </div>
        <div>
            <div>
                <Forms.Button color="transparent" flat icon size="20px" :text-color="SHUFFLE_BUTTON_COLOR[shuffleState]"
                    @click.stop="toggleShuffle">shuffle</Forms.Button>
                <Forms.Button color="transparent" flat icon>skip_previous</Forms.Button>
                <Forms.Button color="white" flat icon text-color="black" @click.stop="toggleState">
                    {{ STATE_BUTTON_ICON[playerState] }}
                </Forms.Button>
                <Forms.Button color="transparent" flat icon>skip_next</Forms.Button>
                <Forms.Button color="transparent" flat icon size="20px" :text-color="REPEAT_BUTTON_COLOR[repeatState]"
                    @click.stop="toggleRepeat">{{ REPEAT_BUTTON_ICON[repeatState] }}</Forms.Button>
            </div>
            <Forms.Slider v-model="currentTime" :max="currentTrack.duration_ms / 1000"></Forms.Slider>
        </div>
        <div></div>
    </div>
</template>

<style lang="postcss" scoped>
div.player {
    @apply flex;
    @apply h-24 min-h-[6rem] p-4;
    @apply border-t border-neutral-800;
    @apply bg-[#181818];

    >div:nth-child(1) {
        @apply flex items-center space-x-2;
        @apply w-[30%] h-full;

        >img {
            @apply h-[inherit];
            @apply shadow;
        }
    }

    >div:nth-child(2) {
        @apply flex flex-col justify-center items-center;
        @apply w-[40%];

        >div:nth-child(1) {
            @apply flex justify-between items-center;
            @apply w-1/4 py-2;
        }
    }

    >div:nth-child(3) {
        @apply w-[30%];
    }
}
</style>
