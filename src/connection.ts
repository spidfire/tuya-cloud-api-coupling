import * as qs from 'qs';
import * as crypto from 'crypto';
import {default as axios, AxiosInstance} from 'axios';

interface ConnectionConfigInterface {
    /* Service address */
    host: string,
    /* Access Id */
    accessId: string,
    /* Access Secret */
    accessSecret: string,
}

export default class Connection {
    // Based on code sample https://images.tuyacn.com/smart/Signature_Demo/en/nodejs_demo.ts
    // from page https://developer.tuya.com/en/docs/iot/singnature?id=Ka43a5mtx1gsc
    private httpClient: AxiosInstance;
    private _token: string | null = null;


// User local maintenance highway token
    constructor(
        readonly config: ConnectionConfigInterface
    ) {
        this.httpClient = axios.create({
            baseURL: config.host,
            timeout: 5 * 1e3,
        });
    }

    /**
     * fetch highway login token
     */
    async getToken(): Promise<string> {
        if (this._token) {
            return this._token;
        }

        const method = 'GET';
        const timestamp = Date.now().toString();
        const signUrl = '/v1.0/token?grant_type=1';
        const contentHash = crypto.createHash('sha256').update('').digest('hex');
        const stringToSign = [method, contentHash, '', signUrl].join('\n');
        const signStr = this.config.accessId + timestamp + stringToSign;

        const headers = {
            t: timestamp,
            sign_method: 'HMAC-SHA256',
            client_id: this.config.accessId,
            sign: await this.encryptStr(signStr, this.config.accessSecret),
        };
        const {data: login} = await this.httpClient.get('/v1.0/token?grant_type=1', {headers});
        if (!login || !login['success']) {
            throw Error(`Authorization Failed: ${login['msg']}`);
        }
        this._token = login.result.access_token;
        return login.result.access_token
    }

    /**
     * fetch highway business data
     */
    async get(url: string, query: {}) {
        const method = 'GET';
        const reqHeaders: { [k: string]: string } = await this.getRequestSign(url, method, query);

        const {data} = await this.httpClient.request({
            method,
            data: {},
            params: {},
            headers: reqHeaders,
            url: reqHeaders.path,
        });
        if (!data || !data['success']) {
            throw Error(`Request highway Failed: ${data['msg']}`);
        }
        return data
    }

    /**
     * fetch highway business data
     */
    async post(url: string, query: object, body: object) {
        const method = 'POST';
        const reqHeaders: { [k: string]: string } = await this.getRequestSign(url, method, query, body);

        const {data} = await this.httpClient.request({
            method,
            data: body,
            params: {},
            headers: reqHeaders,
            url: reqHeaders.path,
        });
        if (!data || !data['success']) {
            throw Error(`Request highway Failed: ${data['msg']}`);
        }
        return data
    }

    /**
     * HMAC-SHA256 crypto function
     */
    async encryptStr(str: string, secret: string): Promise<string> {
        return crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase();
    }

    /**
     * Request signature, which can be passed as headers
     * @param path
     * @param method
     * @param query
     * @param body
     */
    async getRequestSign(
        path: string,
        method: string,
        query: { [k: string]: any } = {},
        body: { [k: string]: any } = {},
    ): Promise<{ [k: string]: string; }> {
        const t = Date.now().toString();
        const [uri, pathQuery] = path.split('?');
        const queryMerged = Object.assign(query, qs.parse(pathQuery));
        const sortedQuery: { [k: string]: (string | null) } = {};
        Object.keys(queryMerged)
            .sort()
            .forEach((i) => (sortedQuery[i] = query[i]));

        const querystring = decodeURIComponent(qs.stringify(sortedQuery));
        const url = querystring ? `${uri}?${querystring}` : uri;
        const contentHash = crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
        const stringToSign = [method, contentHash, '', url].join('\n');
        const token = await this.getToken();
        const signStr = this.config.accessId + token + t + stringToSign;
        return {
            t,
            path: url,
            client_id: this.config.accessId,
            sign: await this.encryptStr(signStr, this.config.accessSecret),
            sign_method: 'HMAC-SHA256',
            access_token: token,
        };
    }
}