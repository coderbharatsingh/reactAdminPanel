import { createConfiguration } from './ApiConfiguration';
import EduleteApi from './EduleteApi';
import IEduleteApiTokenHolders from './IEduleteApiTokenHolders';
import EduleteApiTokenHolders from './EduleteApiTokenHolders';
import { IEduleteApi } from './IEduleteApi';

const config = createConfiguration();

const eduleteApi: IEduleteApi = new EduleteApi(config);

const eduleteApiTokenHolders: IEduleteApiTokenHolders = new EduleteApiTokenHolders();

export { eduleteApi as EduleteApi, eduleteApiTokenHolders as EduleteApiTokenHolders };
