import { createAction } from 'redux-actions';
import types from './types';

export default {
    handleError: createAction(types.HANDLE_ERROR),
    setError: createAction(types.SET_ERROR),
    cleError: createAction(types.CLEAR_ERROR),
};
