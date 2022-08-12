<script lang="ts" setup>
import { computed, toRefs } from 'vue';

type Props = {
    max?: number;
    modelValue?: number;
};

const props = withDefaults(defineProps<Props>(), {
    max: 100,
    modelValue: 0,
});

const { max, modelValue } = toRefs(props);
const emit = defineEmits(['update:modelValue']);

const input = (e: Event) => {
    const event = e as InputEvent;

    if (event.target) {
        const { value } = event.target as HTMLInputElement;
        emit('update:modelValue', +value);
    }
};

const size = computed(() => {
    const percentage = Math.min(modelValue.value, max.value) / max.value;
    const rounded = (Math.round((percentage + Number.EPSILON) * 1e+4) / 1e+4) * 100;

    return rounded + '%';
});
</script>

<template>
    <div class="slider">
        <input type="range" @input.stop="input" :value="modelValue" :max="max" />

        <div class="overlay">
            <div :style="{ width: size }" />
            <div />

            <div :style="{ left: size }" />
        </div>
    </div>
</template>

<style lang="postcss" scoped>
* {
    transition: none;
    -moz-transition: none;
    -webkit-transition: none;
}

div.slider {
    @apply flex items-center;
    @apply w-full h-[24px] min-h-[24px] relative;

    >input {
        @apply w-full h-full absolute;
        @apply appearance-none opacity-0;
        @apply z-20 cursor-pointer;
    }

    >div.overlay {
        @apply w-full h-[4px] relative;

        >div:nth-child(1) {
            @apply absolute top-0 bottom-0;
            @apply rounded-md bg-primary;
            @apply z-10;
        }

        >div:nth-child(2) {
            @apply w-full absolute top-0 bottom-0;
            @apply rounded-md bg-white/20;
        }

        >div:nth-child(3) {
            @apply w-[12px] h-[12px] absolute top-0 left-0;
            @apply shadow z-10 bg-white;

            border-radius: 50%;
            transform: translate(-6px, -4px);
        }
    }

    &:not(:hover) {
        >div.overlay {
            >div:nth-child(1) {
                @apply bg-white;
            }

            >div:nth-child(3) {
                @apply invisible;
            }
        }
    }
}
</style>
