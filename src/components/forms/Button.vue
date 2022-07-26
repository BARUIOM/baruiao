<script lang="ts" setup>
type Props = {
    color?: 'primary' | string;
};

withDefaults(defineProps<Props>(), {
    color: 'primary'
});
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    computed: {
        primary() {
            return this.color === 'primary';
        },
    },
});
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
