<script lang="ts" setup>
import { nextTick, onMounted } from 'vue';

import { useSpotify } from '@/modules/Spotify';
import { toCardData } from '@/modules/DataTypes';

import Collection from '@/components/Collection.vue';
import SectionTitle from '@/components/SectionTitle.vue';

const { userSavedArtists } = useSpotify();

onMounted(async function fetchArtists() {
    const hasNext = await userSavedArtists.load()
        .then(() => userSavedArtists.next());

    if (hasNext)
        nextTick(fetchArtists);
});
</script>

<template>
    <SectionTitle>Artists you follow</SectionTitle>
    <Collection :items="userSavedArtists.items.map(toCardData)" wrap />
</template>
