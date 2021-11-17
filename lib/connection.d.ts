interface ConnectionConfigInterface {
    host: string;
    accessId: string;
    accessSecret: string;
}
export default class Connection {
    readonly config: ConnectionConfigInterface;
    private httpClient;
    private _token;
    constructor(config: ConnectionConfigInterface);
    /**
     * fetch highway login token
     */
    getToken(): Promise<string>;
    /**
     * fetch highway business data
     */
    get(url: string, query: {}): Promise<any>;
    /**
     * fetch highway business data
     */
    post(url: string, query: object, body: object): Promise<any>;
    /**
     * HMAC-SHA256 crypto function
     */
    encryptStr(str: string, secret: string): Promise<string>;
    /**
     * Request signature, which can be passed as headers
     * @param path
     * @param method
     * @param query
     * @param body
     */
    getRequestSign(path: string, method: string, query?: {
        [k: string]: any;
    }, body?: {
        [k: string]: any;
    }): Promise<{
        [k: string]: string;
    }>;
}
export {};
