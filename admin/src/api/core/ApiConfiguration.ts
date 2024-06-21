import RestApiConfiguration from '../rest/core/RestApiConfiguration';

export default interface ApiConfiguration {
    url: string;
    port: number;
    globalPrefix: string | undefined;
    rest: RestApiConfiguration;
}
