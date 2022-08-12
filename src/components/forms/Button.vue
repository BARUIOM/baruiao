<script lang="ts" setup>
import { computed } from 'vue';

type Props = {
    color?: 'primary' | string;
};

const { color } = withDefaults(defineProps<Props>(), {
    color: 'primary'
});

const primary = computed<boolean>(() => color === 'primary');
</script>

<template>
    <button :class="{ primary }" :style="{ '--color': color }">
        <slot></slot>
    </button>
</template>

<style lang="postcss" scoped>
button {
    @apply w-full h-10;
    @apply rounded outline-none;
    @apply transition-shadow;

    background-color: var(--color);

    &:hover {
        @apply shadow-md;
    }
}

button.primary {
    @apply bg-primary;
}
</style>
