<script lang="ts" setup>
import { h } from 'vue';

type Props = {
    size?: number | string;
    color?: string;
};

const radius = 20;
const width = 4;

const { color, size } = withDefaults(defineProps<Props>(), {
    color: 'primary',
    size: 32,
});

const primary = color === 'primary';
const box = Math.ceil(radius / (1 - +width / +size));

const circle = h('circle', {
    'r': radius,
    'cx': 2 * box,
    'cy': 2 * box,
    'fill': 'transparent',
    'stroke-width': Math.ceil(+width / +size * box * 2),
    class: { primary },
    style: { '--color': color },
});

const svg = h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: `${box} ${box} ${2 * box} ${2 * box}`,
}, [circle]);

const ProgressCircular = () => h('figure', {
    class: 'progress-circular',
    style: {
        width: +size + 'px',
        height: +size + 'px',
    },
}, [svg]);
</script>

<template>
    <ProgressCircular />
</template>

<style lang="postcss">
figure.progress-circular {
    @apply inline-flex justify-center items-center;
    @apply relative align-middle;

    >svg {
        @apply absolute w-full h-full;
        @apply inset-0 m-auto z-0;

        transform-origin: center center;
        animation: progress-circular-rotate 1.4s linear infinite;
        transition: all .2s ease-in-out;

        >circle {
            @apply z-[2];

            animation: progress-circular-dash 1.4s ease-in-out infinite;
            transition: all .6s ease-in-out;

            stroke: var(--color);
            stroke-linecap: square;
            stroke-dasharray: 80, 200;
            stroke-dashoffset: 0px;
        }

        >circle.primary {
            @apply stroke-primary;
        }
    }

    @keyframes progress-circular-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0px;
        }

        50% {
            stroke-dasharray: 100, 200;
            stroke-dashoffset: -15px;
        }

        100% {
            stroke-dasharray: 100, 200;
            stroke-dashoffset: -124px;
        }
    }

    @keyframes progress-circular-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
}
</style>
