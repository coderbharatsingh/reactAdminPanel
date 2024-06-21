import { createAction } from 'redux-actions';
import types from './types';

export default {
    initApp: createAction(types.APP_INIT),
};
