import RestApi from './rest/RestApi';
import ApiConfiguration from './core/ApiConfiguration';
import ApiDelegate from './core/ApiDelegate';
import { getHeaders } from './ApiUtils';
import { IEduleteApi } from './IEduleteApi';
import { toast } from 'react-toastify';
import Cookies from 'cookies-ts';
import { EduleteApiTokenHolders } from './index';
import 'react-toastify/dist/ReactToastify.css';

export default class EduleteApi implements IEduleteApi {
    private readonly restApi: RestApi;
    private cookies = new Cookies();

    constructor(configuration: ApiConfiguration) {
        let baseUrl = `${configuration.url}:${configuration.port}`;
        baseUrl = window.location.origin;
        if (configuration.globalPrefix) baseUrl += configuration.globalPrefix;

        const delegate: ApiDelegate = {
            getHeaders,
        };

        this.restApi = new RestApi(
            //
            baseUrl,
            configuration.rest,
            delegate
        );
    }

    public async getResult(method: void) {
        try {
            const res = await method;

            if(res['tokens']){
                if(res['tokens']['adminAccessToken'] && process.env.REACT_APP_ADMIN_TOKEN_NAME) {
                    if(this.cookies.get(process.env.REACT_APP_ADMIN_TOKEN_NAME) !== res['tokens']['adminAccessToken']['token']) {
                        this.cookies.set(process.env.REACT_APP_ADMIN_TOKEN_NAME, res['tokens']['adminAccessToken']['token'], { expires: new Date(res['tokens']['adminAccessToken']['expires']) });
                    }
                }
                if(res['tokens']['adminRefreshToken'] && process.env.REACT_APP_ADMIN_REFRESH_TOKEN_NAME) {
                    if(this.cookies.get(process.env.REACT_APP_ADMIN_REFRESH_TOKEN_NAME) !== res['tokens']['adminRefreshToken']['token']) {
                        this.cookies.set(process.env.REACT_APP_ADMIN_REFRESH_TOKEN_NAME, res['tokens']['adminRefreshToken']['token'], { expires: new Date(res['tokens']['adminRefreshToken']['expires']) });
                    }
                }

                EduleteApiTokenHolders.updateAllTokens();
            }
            
            if(res['message']) {
                toast.success(res['message'], {
                    autoClose: 2000
                });
            }

            return res;
        } catch(err) {
            const ret = { err: true, error: true };
            if(err && typeof err === 'object') {
                if(err['message']) {
                    toast.error(err['message'], {
                        autoClose: 2000
                    });
                }
                if(err['code']) {
                    ret['code'] = err['code'];
                }
            }
            return ret;
        }
    }

    public async logout() {
        if(process.env.REACT_APP_ADMIN_REFRESH_TOKEN_NAME) {
            const token = this.cookies.get(process.env.REACT_APP_ADMIN_REFRESH_TOKEN_NAME);
            if(token) return await this.restApi.logout(token);
        } else {
            return false;
        }
    }

    public async verifyToken() {
        if(process.env.REACT_APP_ADMIN_TOKEN_NAME) {
            const token = this.cookies.get(process.env.REACT_APP_ADMIN_TOKEN_NAME);
            if(token) return await this.restApi.verifyToken(token);
        } else {
            return false;
        }
    }

    public async refreshToken() {
        if(process.env.REACT_APP_ADMIN_REFRESH_TOKEN_NAME) {
            const token = this.cookies.get(process.env.REACT_APP_ADMIN_REFRESH_TOKEN_NAME);
            if(token) return await this.restApi.refreshToken(token);
        } else {
            return false;
        }
    }

    public async getUserDetails() {
        return await this.restApi.getUserDetails();
    }

    public async dashboard(options?: object) {
        return await this.restApi.dashboard(options);
    }

    public async quizOverview(options: object) {
        return await this.restApi.quizOverview(options);
    }

    public async masquerade(mobile: string) {
        return await this.restApi.masquerade(mobile);
    }

    public async btnRequest(url: string) {
        return await this.restApi.btnRequest(url);
    }

    public async btnRequestPost(url: string, field: object) {
        return await this.restApi.btnRequestPost(url, field);
    }

    public async getFormFields(page: string) {
        return await this.restApi.getFormFields(page);
    }

    public async getEntries(page: string, field: object) {
        return await this.restApi.getEntries(page, field);
    }

    public async getOptions(page: string, field: object) {
        return await this.restApi.getOptions(page, field);
    }

    public async createEntry(page: string, field: object, filters: string[]) {
        return await this.restApi.createEntry(page, field, filters);
    }

    public async updateEntry(page: string, id: string, field: object, filters: string[]) {
        return await this.restApi.updateEntry(page, id, field, filters);
    }

    public async deleteEntry(page: string, id: string) {
        return await this.restApi.deleteEntry(page, id);
    }

    public async importEntries(page: string, field: object) {
        return await this.restApi.importEntries(page, field);
    }

    public async uploadFileFromEditor(fileInfo: { name: string, type: string, size: number, value: string }) {
        return await this.restApi.uploadFileFromEditor(fileInfo);
    }
}
