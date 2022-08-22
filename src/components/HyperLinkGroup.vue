<script lang="ts" setup>
import type { MaybeHyperLink } from '@/modules/DataTypes';

import HyperLink from './HyperLink.vue';

type Props = {
    data?: MaybeHyperLink[];
};

withDefaults(defineProps<Props>(), {
    data: () => [],
});
</script>

<template>
    <section v-if="data.length">
        <template v-for="({ href, name }) in data">
            <HyperLink v-if="href" :href="href" :name="name" />
            <slot v-else name="fallback" v-bind="{ name }"></slot>
        </template>
    </section>
</template>

<style lang="postcss" scoped>
section {
    @apply text-neutral-400;

    :nth-child(n+2)::before {
        @apply inline-block mr-1;

        content: ',';
        font-size: inherit;
    }
}
</style>
