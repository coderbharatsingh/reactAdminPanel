import { handleActions, ReducerNextThrow } from 'redux-actions';
import { empty, failed, loading, success } from '../../entities/LoadableContainer';
import types from './types';

// type ReducerState = LoadableBook;
//
// const fetchBookDownloadComplete: ReducerNextThrow<ReducerState, BookContainer> = {
//     next: (_, {payload}) =>{
//         return success(payload)
//     },
//     throw: (_, {payload}) => failed(payload),
// };

export default handleActions<any, any>(
    {
        //
        // [types.FETCH_BOOK]: (state) => loading(state),
        // [types.FETCH_BOOK_COMPLETE]: fetchBookDownloadComplete,
    },
    empty()
);
