<script lang="ts" setup>
import Player from '@/modules/Player';

import TrackListItem from './TrackListItem.vue';

type Props = {
    tracks: SpotifyApi.TrackObjectFull[];
};

defineProps<Props>();

const play = (track: SpotifyApi.TrackObjectFull) => {
    Player.pause();
    return Player.load(track)
        .then(Player.play);
};
</script>

<template>
    <div class="p-2">
        <template v-for="track in tracks" :key="track.id">
            <TrackListItem :track="track" @click.stop="play(track)"></TrackListItem>
        </template>
    </div>
</template>
