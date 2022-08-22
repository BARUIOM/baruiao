<script lang="ts" setup>
import { nextTick, onMounted } from 'vue';

import { useSpotify } from '@/modules/Spotify';
import { toCardData } from '@/modules/DataTypes';

import Collection from '@/components/Collection.vue';
import SectionTitle from '@/components/SectionTitle.vue';

const { userSavedAlbums } = useSpotify();

onMounted(async function fetchAlbums() {
    const hasNext = await userSavedAlbums.load()
        .then(() => userSavedAlbums.next());

    if (hasNext)
        nextTick(fetchAlbums);
});
</script>

<template>
    <SectionTitle>Albums you liked</SectionTitle>
    <Collection :items="userSavedAlbums.items.map(toCardData)" wrap />
</template>
