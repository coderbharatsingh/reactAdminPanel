import { all, takeEvery, put } from 'redux-saga/effects';
import types from './types';
import { Action } from 'redux-actions';

function* handleError({ payload }: Action<any>) {
    console.error(payload);
}

export default function* () {
    yield all([
        //
        takeEvery(types.HANDLE_ERROR, handleError),
    ]);
}
