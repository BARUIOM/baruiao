<script lang="ts" setup>
import { Forms } from '@/components/forms';
import { currentTime, currentTrack } from '@/modules/Player';
</script>

<template>
    <div class="player" v-if="currentTrack">
        <div>
            <img :src="currentTrack.album.images[0].url" />
            <div>
                <div>{{ currentTrack.name }}</div>
                <div class="text-sm text-white/40">{{ currentTrack.artists[0].name }}</div>
            </div>
        </div>
        <div>
            <Forms.Slider v-model="currentTime" :max="currentTrack.duration_ms / 1000"></Forms.Slider>
        </div>
        <div></div>
    </div>
</template>

<style lang="postcss" scoped>
div.player {
    @apply flex;
    @apply h-24 min-h-[6rem] p-4;
    @apply border-t border-white/10;
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
        @apply flex items-center;
        @apply w-[40%];
    }

    >div:nth-child(3) {
        @apply w-[30%];
    }
}
</style>
