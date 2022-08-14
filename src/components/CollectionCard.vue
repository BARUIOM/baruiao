<script lang="ts" setup>
import { useRouter } from 'vue-router';

export type CardMeta = {
    name: string;
    href?: string;
};

export type CardData = {
    title: string;
    cover: string;
    href: string;
    metadata?: CardMeta[];
};

const { href } = withDefaults(defineProps<CardData>(), {
    metadata: () => [],
});

const router = useRouter();

const onclick = () =>
    router.push(href);
</script>

<template>
    <div class="card" @click.stop="onclick">
        <img :src="cover" />
        <div>
            <div>{{ title }}</div>
            <section>
                <template v-for="meta in metadata">
                    <router-link v-if="meta.href" :to="meta.href" @click.stop>{{ meta.name }}</router-link>
                    <span v-else>{{ meta.name }}</span>
                </template>
            </section>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
div.card {
    @apply h-full p-4 space-y-4;
    @apply rounded bg-neutral-900 cursor-pointer;

    transition: background-color .3s ease;

    &:hover {
        @apply bg-neutral-800;
    }

    >img {
        @apply object-cover object-center;
        @apply pointer-events-none shadow-md;
    }

    >div {
        @apply min-h-[64px] space-y-1;

        >div {
            @apply truncate font-bold;
        }

        >section {
            @apply text-sm text-neutral-400 truncate;

            >a:hover {
                @apply text-white underline;
            }

            :nth-child(n+2)::before {
                @apply inline-block mr-1;
                @apply text-sm text-neutral-400;

                content: ',';
            }
        }
    }
}
</style>
