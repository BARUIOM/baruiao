export type Credentials = {
    accessToken: string;
    refreshToken: string;
};

export type TokenValidatorFunction = (accessToken: string) => boolean | Promise<boolean>;
export type TokenRefresherFunction = (refreshToken: string) => string | Promise<string>;

export class AuthStore {

    constructor(
        private readonly key: string,
        private readonly validator?: TokenValidatorFunction,
        private readonly refresher?: TokenRefresherFunction,
    ) { }

    public hasCredentials(): boolean {
        return !!localStorage.getItem(this.key);
    }

    public getCredentials(): Credentials | null {
        if (this.hasCredentials()) {
            const credentials = localStorage.getItem(this.key);

            return JSON.parse(credentials!);
        }

        return null;
    }

    public setCredentials(credentials: Credentials): void {
        localStorage.setItem(this.key, JSON.stringify(credentials));
    }

    public async validate(): Promise<boolean> {
        const credentials = this.getCredentials();

        if (credentials === null)
            throw new Error('Not authenticated');

        if (!this.validator)
            throw new Error('Token validation function not implemented');

        try {
            const valid = await Promise.resolve(
                this.validator(credentials.accessToken)
            );

            return valid;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public async refresh(): Promise<void> {
        const credentials = this.getCredentials();

        if (credentials === null)
            throw new Error('Not authenticated');

        if (!this.refresher)
            throw new Error('Token refreshing function not implemented');

        const { refreshToken } = credentials;
        const accessToken = await Promise.resolve(
            this.refresher(refreshToken)
        );

        this.setCredentials({ accessToken, refreshToken });
    }

}
