<script lang="ts" setup>
import CollectionCard from './CollectionCard.vue';
import type { CardData } from './CollectionCard.vue';

type Collection = {
    items?: CardData[];
    wrap?: boolean;
};

withDefaults(defineProps<Collection>(), {
    items: () => [],
    wrap: false,
});
</script>

<template>
    <div class="collection" :class="{
        'flex-wrap': wrap,
        'flex-nowrap': !wrap
    }">
        <template v-for="item in items">
            <div>
                <CollectionCard v-bind="item" />
            </div>
        </template>
    </div>
</template>

<style lang="postcss" scoped>
div.collection {
    @apply flex;
    @apply overflow-hidden;

    >div {
        @apply w-1/2 min-w-[theme(width.1/2)] p-2;

        @screen sm {
            @apply w-1/4 min-w-[theme(width.1/4)];
        }

        @screen lg {
            @apply w-1/6 min-w-[theme(width.1/6)];
        }

        @screen xl {
            @apply w-1/8 min-w-[theme(width.1/8)];
        }

        @screen 2xl {
            @apply w-1/12 min-w-[theme(width.1/12)];
        }
    }
}
</style>
