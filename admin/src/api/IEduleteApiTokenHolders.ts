export default interface IEduleteApiTokenHolders {
    clearTokens(): boolean;

    clearAccessToken(): boolean;
    
    updateAllTokens(): boolean;
    
    getToken(): EduleteApiToken | undefined;

    setToken(token: EduleteApiToken | undefined): void;

    getRefreshToken(): EduleteApiToken | undefined;

    setRefreshToken(token: EduleteApiToken | undefined): void;

    getUserId(): string | null;

    navigateToPublicPath(): void;
}

export type EduleteApiToken = string;
