<script lang="ts" setup>
import { nextTick, onMounted } from 'vue';

import { useSpotify } from '@/modules/Spotify';

import SectionTitle from '@/components/SectionTitle.vue';
import TrackList from '@/components/TrackList.vue';

const { userSavedTracks } = useSpotify();

onMounted(async function fetchTracks() {
    const hasNext = await userSavedTracks.load()
        .then(() => userSavedTracks.next());

    if (hasNext)
        nextTick(fetchTracks);
});
</script>

<template>
    <SectionTitle>Tracks you liked</SectionTitle>
    <TrackList :tracks="userSavedTracks.items.map(({ track }) => track)" />
</template>
