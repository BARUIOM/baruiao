<script lang="ts" setup>
import Player from '@/components/Player.vue';
</script>

<template>
    <main>
        <div class="header"></div>
        <div class="content">
            <router-view />
        </div>
        <Player></Player>
    </main>
</template>

<style lang="postcss" scoped>
main {
    @apply flex flex-col;
    @apply w-full h-full;

    >div.header {
        @apply h-16 min-h-[4rem];
        @apply border-b border-white/10;
        @apply bg-[#181818];
    }

    >div.content {
        @apply h-full p-2;
        @apply overflow-y-auto;
    }
}
</style>
