import { createAction } from 'redux-actions';
import types from './types';
import { UserContainer } from '../../entities/User';

export type SetUserPayload = UserContainer;

export default {
    getUserDetails: createAction(types.FETCH_USER),
    setUserDetails: createAction<SetUserPayload>(types.FETCH_USER_COMPLETE),
};
