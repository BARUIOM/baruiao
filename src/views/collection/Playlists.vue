<script lang="ts" setup>
import { nextTick, onMounted } from 'vue';

import { useSpotify } from '@/modules/Spotify';
import { toCardData } from '@/modules/Mappings';

import Collection from '@/components/Collection.vue';
import SectionTitle from '@/components/SectionTitle.vue';

const { userSavedPlaylists } = useSpotify();

onMounted(async function fetchPlaylists() {
    const hasNext = await userSavedPlaylists.load()
        .then(() => userSavedPlaylists.next());

    if (hasNext)
        nextTick(fetchPlaylists);
});
</script>

<template>
    <SectionTitle>Playlists you saved</SectionTitle>
    <Collection :items="userSavedPlaylists.items.map(toCardData)" wrap />
</template>
