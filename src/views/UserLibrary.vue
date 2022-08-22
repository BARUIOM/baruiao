<script lang="ts" setup>
import { onMounted } from 'vue';

import { useSpotify } from '@/modules/Spotify';
import { toCardData } from '@/modules/DataTypes';

import Collection from '@/components/Collection.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import TrackList from '@/components/TrackList.vue';

const {
    userSavedAlbums,
    userSavedArtists,
    userSavedPlaylists,
    userSavedTracks
} = useSpotify();

onMounted(() => {
    userSavedAlbums.load();
    userSavedPlaylists.load();
    userSavedArtists.load();
    userSavedTracks.load();
});
</script>

<template>
    <SectionTitle href="/collection/albums">Albums you liked</SectionTitle>
    <Collection :items="userSavedAlbums.items.map(toCardData)" />
    <SectionTitle href="/collection/playlists">Playlists you saved</SectionTitle>
    <Collection :items="userSavedPlaylists.items.map(toCardData)" />
    <SectionTitle href="/collection/artists">Artists you follow</SectionTitle>
    <Collection :items="userSavedArtists.items.map(toCardData)" />
    <SectionTitle href="/collection/tracks">Tracks you liked</SectionTitle>
    <TrackList :limit="10" :tracks="userSavedTracks.items.map(({ track }) => track)"></TrackList>
</template>
