import init, { ReaderStore } from './StateInitializer';
import { Store } from 'redux';

export const getStore = () => {
    const storeInstance = ReaderStore.store;

    if (!storeInstance) {
        return init.initStore();
    }

    const store: Store = storeInstance;

    return store;
};

export const getDispatch = () => {
    const { dispatch } = getStore();

    return dispatch;
};
