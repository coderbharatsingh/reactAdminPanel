import ApiConfiguration from './core/ApiConfiguration';

export const createConfiguration = (): ApiConfiguration => ({
    url: process.env.REACT_APP_URL || '',
    port: parseInt(process.env.REACT_APP_PORT || '80'),
    globalPrefix: '',
    rest: {
        path: '',
    },
});
