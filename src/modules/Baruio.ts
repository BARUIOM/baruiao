import Axios from 'axios';
import { ref } from 'vue';

const BARUIO_AUTH_API_URL = import.meta.env['VITE_BARUIO_AUTH_API_URL'];

const axios = Axios.create({
    baseURL: BARUIO_AUTH_API_URL,
});

export type Credentials = {
    accessToken: string;
    refreshToken: string;
};

export namespace Baruio {

    export const user = ref<Credentials>();

    export async function authenticate(): Promise<boolean> {
        return !!user.value;
    }

    export async function signIn(email: string, password: string): Promise<void> {
        const response = await axios.post<Credentials>(
            '/sign-in', { email, password }
        );

        if (response.status !== 200)
            throw new Error('Error signing in with email and password');

        const { accessToken, refreshToken } = response.data;
        user.value = { accessToken, refreshToken };
    }

}
