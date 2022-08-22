<script lang="ts" setup>
export type HyperLinkData = {
    href: string;
    name: string;
};

defineProps<HyperLinkData>();
</script>

<template>
    <router-link :to="href" @click.stop>{{ name }}</router-link>
</template>

<style lang="postcss" scoped>
a {
    @apply text-neutral-400;

    &::before {
        @apply text-neutral-400;
    }

    &:hover {
        @apply text-white underline;
    }
}
</style>
