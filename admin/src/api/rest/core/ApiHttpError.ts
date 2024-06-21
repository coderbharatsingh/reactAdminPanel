import ApiError from './ApiError';

export default class ApiHttpError extends ApiError {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly data: any,
        public readonly cause: any
    ) {
        super(cause);
    }
}
