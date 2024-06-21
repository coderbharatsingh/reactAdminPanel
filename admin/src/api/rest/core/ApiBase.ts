import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as AxiosLogger from 'axios-logger';
import ApiError from './ApiError';
import RestApiConfiguration from './RestApiConfiguration';
import ApiDelegate from '../../core/ApiDelegate';
import Cookies from 'cookies-ts';
import { ResponseLogConfig } from 'axios-logger/lib/common/types';
import { EduleteApi, EduleteApiTokenHolders } from 'api';

export default abstract class ApiBase {
    private static readonly HEADERS = {};
    private requestAttempt = true;
    private refreshAttempt = 0;

    private readonly api: AxiosInstance;

    public url: string | undefined;

    protected static wrapApiCall(call: AxiosPromise): Promise<any> {
        return call
            .then((response) => Promise.resolve(ApiBase.handleResponse(response)))
            .catch((response) => {
                return Promise.reject(ApiBase.handleError(response));
            });
    }

    abstract refreshToken(userId: string, refreshToken): Promise<any>;

    constructor(baseUrl: string, configuration: RestApiConfiguration, private delegate: ApiDelegate) {
        this.url = `${baseUrl}${configuration.path}`;
        this.api = axios.create({
            baseURL: this.url,
            headers: ApiBase.HEADERS,
            withCredentials: true,
        });

        this.api.interceptors.request.use((value) => {
            /* Hack to avoid bearer token on summary api remove this later */
            //let avoidBearer = value.url.includes('summary') ? '==avoid==' : '';
            return {
                ...value,
                headers: {
                    ...this.delegate.getHeaders(),
                    ...value.headers,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
            };
        });
        // this.api.interceptors.request.use(AxiosLogger.requestLogger, AxiosLogger.errorLogger);
        // this.api.interceptors.response.use(AxiosLogger.responseLogger, AxiosLogger.errorLogger);
        this.api.interceptors.response.use(
            (response) => {
                this.refreshAttempt = 0;
                return response;
            },
            async (error) => {
                if (
                    this.refreshAttempt < 3 &&
                    this.requestAttempt &&
                    error.config &&
                    error.response &&
                    (error.response.status === 401 || error.response.status === 403)
                ) {
                    if(error.response.status === 401) {
                        EduleteApiTokenHolders.clearAccessToken();
                    }

                    if(!EduleteApiTokenHolders.getRefreshToken()) {
                        return EduleteApiTokenHolders.navigateToPublicPath();
                    }

                    this.requestAttempt = false;
                    this.refreshAttempt++;
                    await EduleteApi.getResult(EduleteApi.refreshToken());
                    this.requestAttempt = true;
                    
                    error.config.headers = {
                        ...this.delegate.getHeaders(),
                        ...error.config.headers,
                    };
                    return axios.request(error.config);
                }

                return Promise.reject(error);
            }
        );
    }

    protected request<T>(config: AxiosRequestConfig): Promise<T> {
        return ApiBase.wrapApiCall(this.api.request(config));
    }

    protected get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return ApiBase.wrapApiCall(this.api.get(url, config));
    }

    protected delete(url: string, config?: AxiosRequestConfig): Promise<void> {
        return ApiBase.wrapApiCall(this.api.delete(url, config));
    }

    protected head(url: string, config?: AxiosRequestConfig): Promise<void> {
        return ApiBase.wrapApiCall(this.api.head(url, config));
    }

    protected post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return ApiBase.wrapApiCall(this.api.post(url, data, config));
    }

    protected put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return ApiBase.wrapApiCall(this.api.put(url, data, config));
    }

    protected patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return ApiBase.wrapApiCall(this.api.patch(url, data, config));
    }

    private static handleError(error: AxiosError) {
        const { response } = error;
        if (!response) {
            return new ApiError(error);
        }

        return response.data;
    }

    private static handleResponse<T>(response: AxiosResponse<T>) {
        return response.data;
    }
}
