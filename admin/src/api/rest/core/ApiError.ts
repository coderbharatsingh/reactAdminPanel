export default class ApiError extends Error {
    constructor(public readonly cause: any) {
        super();
    }
}
