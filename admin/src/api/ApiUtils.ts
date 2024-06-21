import { EduleteApiTokenHolders } from './index';
// import Config from 'shared/src/app/Config';
import ApiError from './rest/core/ApiError';
import ApiHttpError from './rest/core/ApiHttpError';
// import AppType from '../entities/AppType';

export const getHeaders = () => {
    EduleteApiTokenHolders.updateAllTokens();
    const token = EduleteApiTokenHolders.getToken();
    const headers: any = {
        // app: AppType.Client,
        // Config.getAppType()
        // platform: Config.getPlatform(),
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};
