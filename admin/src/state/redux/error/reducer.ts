import { handleActions, ReducerNextThrow } from 'redux-actions';
import types from './types';
import { SessionContainer } from '../../entities/Session';

const initialState: any = {
    error: false,
};

const setError: ReducerNextThrow<SessionContainer, any> = {
    next: (state, { payload }) => ({ ...state, error: payload }),
};

export default handleActions<any, any>(
    {
        [types.SET_ERROR]: setError,
        [types.CLEAR_ERROR]: (state) => ({ ...state, error: false }),
    },
    initialState
);
