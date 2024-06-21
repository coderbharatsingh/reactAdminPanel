// @ts-ignore
import State from 'entities/State';
import { rootReducer, rootSaga } from './redux/';
import { Store, Reducer, createStore as reduxCreateStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { Saga } from 'redux-saga';

export const ReaderStore: { store: Store<State> | undefined } = {
    store: undefined,
};

const createStore = <T extends State>(reducer: Reducer<T>, saga: Saga) => {
    if (ReaderStore.store) { return ReaderStore.store }

    // @ts-ignore
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const sagaMiddleware = createSagaMiddleware();

    const store = reduxCreateStore(reducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

    sagaMiddleware.run(saga);

    ReaderStore.store = store;

    return store;
};

export default {
    initStore: () => {
        const store = createStore(rootReducer, rootSaga);
        ReaderStore.store = store;
        return store;
    },
};
