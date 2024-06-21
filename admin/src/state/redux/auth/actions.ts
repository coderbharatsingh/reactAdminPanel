import { createAction } from 'redux-actions';
import types from './types';

export type TokensPayload = { token: string; refreshToken };

export default {
    setTokens: createAction<TokensPayload>(types.SET_TOKENS),
};
