<script lang="ts" setup>
import { computed, toRefs } from 'vue';

type Props = {
    block?: boolean;
    color?: 'primary' | string;
    flat?: boolean;
    icon?: boolean;
    outlined?: boolean;
    size?: string;
    textColor?: string;
};

const props = withDefaults(defineProps<Props>(), {
    block: false,
    color: 'primary',
    flat: false,
    icon: false,
    outlined: false,
    size: '32px',
    textColor: 'white',
});

const {
    block,
    color,
    flat,
    icon,
    outlined,
    size,
} = props;
const { textColor } = toRefs(props);

const primary = computed<boolean>(() =>
    color === 'primary' || textColor.value === 'primary'
);
</script>

<template>
    <button :class="{ 'w-full': block, flat, icon, outlined, primary }"
        :style="{ '--color': color, '--size': size, '--textColor': textColor }">
        <template v-if="icon">
            <i class="material-icons" :class="{ 'material-icons-outlined': outlined }">
                <slot></slot>
            </i>
        </template>
        <template v-else>
            <i v-if="$slots.icon" class="material-icons"
                :class="{ '-ml-1': $slots.default, 'material-icons-outlined': outlined }">
                <slot name="icon"></slot>
            </i>
            <span v-if="$slots.default">
                <slot></slot>
            </span>
        </template>
    </button>
</template>

<style lang="postcss" scoped>
button {
    @apply h-9 px-4 align-middle space-x-2;
    @apply inline-flex items-center justify-center;
    @apply rounded border-none outline-none select-none;

    background-color: var(--color);
    color: var(--textColor);

    &:not(.icon) {
        &.primary {
            @apply bg-primary;
        }

        >i {
            @apply inline-block;
            @apply w-[18px] h-[18px] text-[18px];
        }

        >span {
            @apply font-medium text-sm uppercase;
            font-family: Roboto, sans-serif;

            line-height: normal;
            letter-spacing: 1.25px;
            text-decoration: none;
        }
    }

    &:not(.flat):not(.icon) {
        @apply transition-shadow;
    }

    &:hover:not(.flat):not(.icon) {
        @apply shadow-md;
    }

    &.icon {
        width: var(--size);
        height: var(--size);

        border-radius: 50%;
        padding: 0;

        &.primary {
            @apply text-primary;
        }

        >i {
            font-size: var(--size);
        }
    }

    &.outlined {
        background-color: transparent;
        border-color: var(--color);
        border-style: solid;
        border-width: 1px;
    }
}
</style>
