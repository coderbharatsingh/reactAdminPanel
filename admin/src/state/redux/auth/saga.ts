import { all, put, takeEvery } from 'redux-saga/effects';
import types from './types';
import { types as appTypes } from '../app';
import { errorActions } from '../error';
import Cookies from 'cookies-ts';
import { EduleteApiTokenHolders } from 'api';

function* init() {
    try {
        const cookies = new Cookies();
        const token = cookies.get(process.env.REACT_APP_TOKEN_NAME || '');
        const refreshToken = cookies.get(process.env.REACT_APP_REFRESH_TOKEN_NAME || '');
        if(token && refreshToken) {
            EduleteApiTokenHolders.setToken(token);
            EduleteApiTokenHolders.setRefreshToken(refreshToken);
        }
    } catch (e) {
        yield put(errorActions.handleError(e));
    }
}

export default function* () {
    yield all([takeEvery(appTypes.APP_INIT, init)]);
}
