<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import Player from '@/modules/Player';

import TrackListItem from './TrackListItem.vue';

type Props = {
    limit?: number;
    tracks: SpotifyApi.TrackObjectFull[];
};

const props = defineProps<Props>();
const { limit, tracks } = toRefs(props);

const play = (track: SpotifyApi.TrackObjectFull) => {
    Player.pause();
    return Player.load(track)
        .then(Player.play);
};

const trackList = computed(() => {
    if (limit?.value)
        return tracks.value.slice(0, limit.value);

    return tracks.value;
});
</script>

<template>
    <div class="p-2">
        <template v-for="track in trackList" :key="track.id">
            <TrackListItem :track="track" @click.stop="play(track)"></TrackListItem>
        </template>
    </div>
</template>
