'use strict';

var qs = require('qs');
var crypto = require('crypto');
var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var qs__namespace = /*#__PURE__*/_interopNamespace(qs);
var crypto__namespace = /*#__PURE__*/_interopNamespace(crypto);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Connection = /** @class */ (function () {
    // User local maintenance highway token
    function Connection(config) {
        this.config = config;
        this._token = null;
        this.httpClient = axios__default["default"].create({
            baseURL: config.host,
            timeout: 5 * 1e3,
        });
    }
    /**
     * fetch highway login token
     */
    Connection.prototype.getToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var method, timestamp, signUrl, contentHash, stringToSign, signStr, headers, login;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this._token) {
                            return [2 /*return*/, this._token];
                        }
                        method = 'GET';
                        timestamp = Date.now().toString();
                        signUrl = '/v1.0/token?grant_type=1';
                        contentHash = crypto__namespace.createHash('sha256').update('').digest('hex');
                        stringToSign = [method, contentHash, '', signUrl].join('\n');
                        signStr = this.config.accessId + timestamp + stringToSign;
                        _a = {
                            t: timestamp,
                            sign_method: 'HMAC-SHA256',
                            client_id: this.config.accessId
                        };
                        return [4 /*yield*/, this.encryptStr(signStr, this.config.accessSecret)];
                    case 1:
                        headers = (_a.sign = _b.sent(),
                            _a);
                        return [4 /*yield*/, this.httpClient.get('/v1.0/token?grant_type=1', { headers: headers })];
                    case 2:
                        login = (_b.sent()).data;
                        if (!login || !login['success']) {
                            throw Error("Authorization Failed: " + login['msg']);
                        }
                        this._token = login.result.access_token;
                        return [2 /*return*/, login.result.access_token];
                }
            });
        });
    };
    /**
     * fetch highway business data
     */
    Connection.prototype.get = function (url, query) {
        return __awaiter(this, void 0, void 0, function () {
            var method, reqHeaders, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = 'GET';
                        return [4 /*yield*/, this.getRequestSign(url, method, query)];
                    case 1:
                        reqHeaders = _a.sent();
                        return [4 /*yield*/, this.httpClient.request({
                                method: method,
                                data: {},
                                params: {},
                                headers: reqHeaders,
                                url: reqHeaders.path,
                            })];
                    case 2:
                        data = (_a.sent()).data;
                        if (!data || !data['success']) {
                            throw Error("Request highway Failed: " + data['msg']);
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * fetch highway business data
     */
    Connection.prototype.post = function (url, query, body) {
        return __awaiter(this, void 0, void 0, function () {
            var method, reqHeaders, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = 'POST';
                        return [4 /*yield*/, this.getRequestSign(url, method, query, body)];
                    case 1:
                        reqHeaders = _a.sent();
                        return [4 /*yield*/, this.httpClient.request({
                                method: method,
                                data: body,
                                params: {},
                                headers: reqHeaders,
                                url: reqHeaders.path,
                            })];
                    case 2:
                        data = (_a.sent()).data;
                        if (!data || !data['success']) {
                            throw Error("Request highway Failed: " + data['msg']);
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * HMAC-SHA256 crypto function
     */
    Connection.prototype.encryptStr = function (str, secret) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, crypto__namespace.createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase()];
            });
        });
    };
    /**
     * Request signature, which can be passed as headers
     * @param path
     * @param method
     * @param query
     * @param body
     */
    Connection.prototype.getRequestSign = function (path, method, query, body) {
        if (query === void 0) { query = {}; }
        if (body === void 0) { body = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var t, _a, uri, pathQuery, queryMerged, sortedQuery, querystring, url, contentHash, stringToSign, token, signStr;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        t = Date.now().toString();
                        _a = path.split('?'), uri = _a[0], pathQuery = _a[1];
                        queryMerged = Object.assign(query, qs__namespace.parse(pathQuery));
                        sortedQuery = {};
                        Object.keys(queryMerged)
                            .sort()
                            .forEach(function (i) { return (sortedQuery[i] = query[i]); });
                        querystring = decodeURIComponent(qs__namespace.stringify(sortedQuery));
                        url = querystring ? uri + "?" + querystring : uri;
                        contentHash = crypto__namespace.createHash('sha256').update(JSON.stringify(body)).digest('hex');
                        stringToSign = [method, contentHash, '', url].join('\n');
                        return [4 /*yield*/, this.getToken()];
                    case 1:
                        token = _c.sent();
                        signStr = this.config.accessId + token + t + stringToSign;
                        _b = {
                            t: t,
                            path: url,
                            client_id: this.config.accessId
                        };
                        return [4 /*yield*/, this.encryptStr(signStr, this.config.accessSecret)];
                    case 2: return [2 /*return*/, (_b.sign = _c.sent(),
                            _b.sign_method = 'HMAC-SHA256',
                            _b.access_token = token,
                            _b)];
                }
            });
        });
    };
    return Connection;
}());

var index = {
    Connection: Connection
};

module.exports = index;
