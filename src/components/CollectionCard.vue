<script lang="ts" setup>
import { useRouter } from 'vue-router';

import type { MaybeHyperLink } from '@/modules/DataTypes';
import HyperLinkGroup from './HyperLinkGroup.vue';

export type CardData = {
    title: string;
    cover: string;
    href: string;
    metadata?: MaybeHyperLink[];
};

const { href } = withDefaults(defineProps<CardData>(), {
    metadata: () => [],
});

const router = useRouter();

const onclick = () =>
    router.push(href);
</script>

<template>
    <div class="card" @click.stop="onclick">
        <div :style="{ backgroundImage: `url(${cover})` }" />
        <div>
            <div>{{ title }}</div>
            <HyperLinkGroup class="text-sm truncate" :data="metadata">
                <template v-slot:fallback="{ name }">
                    <span>{{ name }}</span>
                </template>
            </HyperLinkGroup>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
div.card {
    @apply h-full p-4 space-y-4;
    @apply rounded bg-neutral-900 cursor-pointer;

    transition: background-color .3s ease;

    &:hover {
        @apply bg-neutral-800;
    }

    >div:nth-child(1) {
        @apply bg-cover bg-center;
        @apply pb-[100%] shadow-md;
    }

    >div:nth-child(2) {
        @apply min-h-[64px] space-y-1;

        >div {
            @apply truncate font-bold;
        }
    }
}
</style>
