import IEduleteApiTokenHolders, { EduleteApiToken } from './IEduleteApiTokenHolders';
import jwtDecode from 'jwt-decode';
import Cookies from 'cookies-ts';
import { useHistory } from 'react-router-dom';

export default class EduleteApiTokenHolders implements IEduleteApiTokenHolders {
    private cookies = new Cookies();
    private token: EduleteApiToken | undefined = undefined;
    private refreshToken: EduleteApiToken | undefined = undefined;

    constructor() {
        this.updateAllTokens();
    }
    
    updateAllTokens(){
        const token = this.cookies.get(process.env.REACT_APP_ADMIN_TOKEN_NAME || '');
        const refreshToken = this.cookies.get(process.env.REACT_APP_ADMIN_REFRESH_TOKEN_NAME || '');
        this.setToken(token ? token : undefined);
        this.setRefreshToken(refreshToken ? refreshToken : undefined);
        return true;
    }

    clearTokens(): boolean {
        this.clearAccessToken();
        this.setRefreshToken(undefined);
        if(process.env.REACT_APP_ADMIN_REFRESH_TOKEN_NAME) {
            this.cookies.remove(process.env.REACT_APP_ADMIN_REFRESH_TOKEN_NAME);
        }

        return true;
    }

    clearAccessToken(): boolean {
        this.setToken(undefined);
        if(process.env.REACT_APP_ADMIN_TOKEN_NAME) {
            this.cookies.remove(process.env.REACT_APP_ADMIN_TOKEN_NAME);
        }

        return true;
    }

    setToken(token: EduleteApiToken | undefined) {
        this.token = token;
    }

    getToken(): EduleteApiToken | undefined {
        return this.token;
    }

    setRefreshToken(token: EduleteApiToken | undefined) {
        this.refreshToken = token;
    }

    getRefreshToken(): EduleteApiToken | undefined {
        return this.refreshToken;
    }

    getUserId() {
        const token = this.getToken();
        if (token) {
            const userId = jwtDecode<any>(token).userId;
            return userId;
        }
        return null;
    }

    navigateToPublicPath() {
        window.open(process.env.REACT_APP_BASEURL + 'admin/login', '_self');
    }
}
