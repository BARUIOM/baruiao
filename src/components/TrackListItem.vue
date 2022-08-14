<script lang="ts" setup>
type Props = {
    track: SpotifyApi.TrackObjectFull;
};

defineProps<Props>();
</script>

<template>
    <div class="track-list-item">
        <img :src="track.album.images[1].url" />
        <div>
            <div>{{ track.name }}</div>
            <div class="text-sm text-neutral-400">
                {{ track.artists.map((e) => e.name).join(", ") }}
            </div>
        </div>
        <div>
            <i class="material-icons">more_horiz</i>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
div.track-list-item {
    @apply h-14;
    @apply flex items-center;
    @apply cursor-pointer rounded;

    &:hover {
        @apply bg-neutral-800;
    }

    >img:nth-child(1) {
        @apply w-10 h-10 mx-4;
        @apply object-cover object-center;
        @apply pointer-events-none;
    }

    >div:nth-child(3) {
        @apply flex justify-center items-center;
        @apply ml-auto mr-4;
    }
}
</style>
