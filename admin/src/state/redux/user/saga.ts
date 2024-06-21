import { all, put, takeEvery } from 'redux-saga/effects';
import { Action } from 'redux-actions';
import actions, { SetUserPayload } from './actions';
import { EduleteApi } from '../../../api';
import { errorActions } from '../error';
import types from './types';
import { User } from '../../entities/User';

function* getUserDetails() {
    try {
        const userData: User = yield EduleteApi.getUserDetails();
        yield put(actions.setUserDetails({ user: userData }));
    } catch (e) {
        yield put(errorActions.handleError(e));
    }
}

function* setUserDetails({ error }: Action<SetUserPayload>) {
    if (error) {
        yield put(errorActions.handleError(error));
    }
}

export default function* () {
    yield all([
        takeEvery(types.FETCH_USER, getUserDetails),
        takeEvery(types.FETCH_USER_COMPLETE, setUserDetails),
    ]);
}
