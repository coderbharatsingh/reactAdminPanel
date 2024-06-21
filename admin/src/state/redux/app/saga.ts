import { all, put, takeEvery } from 'redux-saga/effects';
import types from './types';
import { errorActions } from '../error';

function* initApp() {
    try {
    } catch (e) {
        yield put(errorActions.handleError(e));
    }
}

export default function* () {
    yield all([takeEvery(types.APP_INIT, initApp)]);
}
