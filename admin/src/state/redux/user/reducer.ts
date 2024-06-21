import { handleActions, ReducerMap, ReducerNextThrow } from 'redux-actions';
import types from './types';
import { empty, failed, loading, success } from '../../entities/LoadableContainer';
import { UserContainer, UserData } from '../../entities/User';
import { LoadableUser } from '../../entities/State';

type ReducerState = LoadableUser;

const setUser: ReducerNextThrow<ReducerState, UserContainer> = {
    next: (_, { payload }) => {
        return success(payload);
    },
    throw: (_, { payload }) => failed(payload),
};

const updateUserDetails: ReducerNextThrow<ReducerState, UserData> = {
    next: (_, { payload }) => {
        return success({ ..._, user: { ..._.user, data: { ..._.user.data, ...payload }}});
    },
    throw: (_, { payload }) => failed(payload),
};

export default handleActions<ReducerState, any>(
    {
        [types.FETCH_USER]: (state) => loading(state),
        [types.FETCH_USER_COMPLETE]: setUser,
    },
    empty()
);
