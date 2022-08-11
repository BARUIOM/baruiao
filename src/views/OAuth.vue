<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Baruio } from '@/modules/Baruio';
import { Spotify } from '@/modules/Spotify';

import ProgressCircular from '@/components/ProgressCircular.vue';

type OAuthProvider = {
    name: string;
    redirect: () => void;
    validate: (code: string) => void;
};

type OAuthProviderDictionary = {
    [name: string]: OAuthProvider;
};

const { params, query } = useRoute();
const router = useRouter();

const code = query['code'] as string | undefined;
const validation = typeof code === 'string' && !!code.length;

const provider = computed<string | null>(() => {
    if (typeof params['provider'] === 'string' && params['provider'].length)
        return params['provider'];

    const state = Baruio.getState();
    if (state && state.name === 'oauth' && 'provider' in state)
        return state['provider'];

    return null;
});

const providers: OAuthProviderDictionary = {
    'spotify': {
        name: 'Spotify',
        redirect: () => {
            window.open(Baruio.getOAuthURL('spotify'), '_self');
        },
        validate: async (code: string) => {
            const credentials = await Baruio.getOAuthCredentials('spotify', code);
            Spotify.auth.setCredentials(credentials);
        },
    },
};

const Provider = providers[provider.value!];

onMounted(() => {
    router.replace({ query: {} });

    if (!Provider)
        return router.replace({ name: 'login' });

    if (validation)
        return Promise.resolve(Provider.validate(code))
            .then(() => {
                Baruio.clearState();
                router.replace({ name: 'userLibrary' });
            });

    setTimeout(() => {
        Provider.redirect();
        Baruio.setState('oauth', { provider: provider.value! });
    }, 3000);
});
</script>

<template>
    <div class="oauth" v-if="provider">
        <ProgressCircular size="64"></ProgressCircular>
        <template v-if="validation">
            <span>Validating your request</span>
        </template>
        <template v-else>
            <span>Redirecting you to {{ Provider.name }}</span>
        </template>
    </div>
</template>

<style lang="postcss" scoped>
div.oauth {
    @apply flex flex-col items-center justify-center;
    @apply w-full h-full space-y-2;
    @apply text-xl font-medium;
}
</style>
