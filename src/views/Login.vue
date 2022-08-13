<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Forms } from '@/components/forms';
import { Baruio } from '@/modules/Baruio';

const router = useRouter();

const username = ref<string>('');
const password = ref<string>('');

const signIn = async () => {
    const provider = 'spotify';

    return Baruio.signIn(username.value, password.value)
        .then(() =>
            router.replace({
                name: 'oauth',
                params: { provider }
            })
        );
};
</script>

<template>
    <main>
        <div>
            <div class="text-xl text-center font-bold">Connect to Baruio</div>

            <Forms.TextField label="Username" v-model="username" />
            <Forms.TextField label="Password" type="password" v-model="password" />

            <Forms.Button @click.stop="signIn" block>Sign in</Forms.Button>
        </div>
    </main>
</template>

<style lang="postcss" scoped>
main {
    @apply w-full h-full;
    @apply flex justify-center items-center;
    @apply p-4;

    >div {
        @apply w-full;
        @apply flex flex-col;
        @apply p-4 space-y-4;
        @apply bg-neutral-900 rounded;

        @media screen(sm) {
            @apply w-1/2;
        }

        @media screen(md) {
            @apply w-1/3;
        }

        @media screen(xl) {
            @apply w-1/4;
        }

        @media screen(2xl) {
            @apply w-1/6;
        }
    }
}
</style>
