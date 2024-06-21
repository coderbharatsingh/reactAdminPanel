import { reducer as errorReducer, saga as errorSaga } from './error';
import { reducer as userReducer, saga as userSaga } from './user';
import { reducer as authReducer, saga as authSaga } from './auth';
import { saga as appSaga } from './app';

import { combineReducers } from 'redux';
import State from '../entities/State';
import { all } from 'redux-saga/effects';

export const rootReducer = combineReducers<State>({
    loadableUser: userReducer,
    error: errorReducer,
    auth: authReducer,
});

export function* rootSaga() {
    yield all([
        appSaga(),
        userSaga(),
        authSaga(),
        errorSaga(),
    ]);
}
