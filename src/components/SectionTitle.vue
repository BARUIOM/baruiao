<script lang="ts" setup>
type Props = {
    href?: string;
};

defineProps<Props>();
</script>

<template>
    <div class="title">
        <span>
            <slot></slot>
        </span>
        <router-link v-if="href" :to="href">
            <span>View all</span>
            <i class="material-icons">chevron_right</i>
        </router-link>
    </div>
</template>

<style lang="postcss" scoped>
div.title {
    @apply flex items-center justify-between p-2;
    @apply border-b border-neutral-800;

    >span:nth-child(1) {
        @apply text-2xl font-bold;
    }

    >a:nth-child(2) {
        @apply inline-flex items-center;
        @apply text-sm text-neutral-400;

        &:hover {
            @apply text-white;

            >span {
                @apply underline;
            }
        }

        >span {
            @apply font-medium uppercase;

            line-height: initial;
        }

        >i {
            @apply text-[20px];
        }
    }

}
</style>
