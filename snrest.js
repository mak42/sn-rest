var promise = require('promise');
var request = require('request-promise');
var querystring = require('querystring');

function SnRestClient(config) {

    function getBaseUrl(host, table) {
        return 'https://' + host + '/' + table + '.do?JSONv2=&';
    }

    function getHttpClient(config) {
        return request.defaults({
            json: true,
            auth: {
                user: config.user,
                pass: config.pass,
                sendImmediately: true
            },
            headers: {
                'Content-Type': 'application/json',
                'Accepts': 'application/json'
            }
        });
    }

    return function(table) {
        return {
            baseUrl: getBaseUrl(config.host, table),
            httpClient: getHttpClient(config),
            getKeys: function(query) {
                var params = querystring.stringify({
                    "sysparm_action": "getKeys",
                    "sysparm_query" : query
                });
                return this.httpClient.get(this.baseUrl + params);
            },
            get: function(sysId) {
                var params = querystring.stringify({
                    "sysparm_action": "get",
                    "sysparm_sys_id" : sysId
                });
                return this.httpClient.get(this.baseUrl + params);
            },
            getRecords: function(query) {
                var params = querystring.stringify({
                    "sysparm_action": "getRecords",
                    "sysparm_query": query
                });
                return this.httpClient.get(this.baseUrl + params);
            },
            update: function(object, query) {
                var params = querystring.stringify({
                    "sysparm_action": "update",
                    "sysparm_query" : query
                });
                var opts = { body: JSON.stringify(object) };
                return this.httpClient.post(this.baseUrl + params, opts);
            },
            insert: function(object) {
                var params = querystring.stringify({
                    "sysparm_action": "insert"
                });
                var opts = { body: JSON.stringify(object) };
                return this.httpClient.post(this.baseUrl + params, opts);
            },
            insertMultiple: function(recordArray) {
                var params = querystring.stringify({
                    "sysparm_action": "insertMultiple"
                });
                var opts = { body: JSON.stringify(recordArray) };
                return this.httpClient.post(this.baseUrl + params, opts);
            },
            deleteRecord: function(sysId) {
                var params = querystring.stringify({
                    "sysparm_action": "deleteRecord"
                });
                var opts = { body: JSON.stringify({"sysparm_sys_id": sysId }) };
                return this.httpClient.post(this.baseUrl + params, opts);
            },
            deleteMultiple: function(query) {
                var params = querystring.stringify({
                    "sysparm_action": "deleteMultiple",
                    "sysparm_query" : query
                });
                return this.httpClient.get(this.baseUrl + params);
            }
        };
    };
}
module.exports = SnRestClient;
