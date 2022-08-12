<script setup lang="ts">
type Props = {
    label?: string;
    type?: 'text' | 'password';

    rounded?: boolean;
    modelValue?: string;
};

withDefaults(defineProps<Props>(), {
    type: 'text',
    rounded: false,
});

const emit = defineEmits(['update:modelValue']);

const input = (e: Event) => {
    const event = e as InputEvent;

    if (event.target) {
        const { value } = event.target as HTMLInputElement;
        emit('update:modelValue', value);
    }
};
</script>

<template>
    <div>
        <label v-if="label">{{ label }}</label>
        <input :class="{ pill: rounded }" :type="type" :value="modelValue" @input="input" />
    </div>
</template>

<style lang="postcss" scoped>
input {
    @apply w-full h-8;
    @apply px-2;
    @apply rounded bg-neutral-800 outline-none;
}

input.pill {
    @apply rounded-full;
}

label {
    @apply mb-1;
    @apply text-sm text-white/40;
}
</style>
