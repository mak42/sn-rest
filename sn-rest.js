var request = require('request');
var querystring = require('querystring');

function SnRestClient(config) {

    function validateResponse(error, response, body) {
        if(error) return error;
        if(response.statusCode != 200) return body;

        var obj = JSON.parse(body);
        if(obj.error) return obj.error;
        if(obj.records) {
            var errors = [];
            for(var i in obj.records) {
                if(i.__error) errors.push(i.__error);
            }
            if(errors.length > 0) {
                return errors;
            }
        }
        return null;
    }

    function restCallbackHandler(error, response, body, callback) {
        var valError = validateResponse(error, response, body);
        if(valError) {
            callback(valError);
            return;
        }
        var resultObj = JSON.parse(body);
        if(resultObj.records.length === 0) {
            callback(null, null);
            return;
        }
        var resultArray = [];
        for(var i = 0; i < resultObj.records.length; i++) {
            var record = resultObj.records[i];
            resultArray.push(record);
        }
        callback(null, resultArray);
    }

    var returnFunc = function(table) {
        return {
            config: config,
            baseUrl: (function() {
                return config.protocol + '://' +
                config.host + '/' + table + '.do?JSONv2=&';
            })(),
            request: request.defaults({
                auth: {
                    user: config.user,
                    pass: config.pass,
                    sendImmediately: true
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accepts': 'application/json'
                }
            }),
            getKeys: function(query, callback) {
                var params = querystring.stringify({
                    "sysparm_action": "getKeys",
                    "sysparm_query" : query
                });
                this.request.get(this.baseUrl + params, function(error, response, body) {
                    restCallbackHandler(error, response, body, callback);
                });
            },
            getRecord: function(sysId, callback) {
                var params = querystring.stringify({
                    "sysparm_action": "get",
                    "sysparm_sys_id" : sysId
                });
                this.request.get(this.baseUrl + params, function(error, response, body) {
                    restCallbackHandler(error, response, body, callback);
                });
            },
            getMultiple: function(query, callback) {
                var params = querystring.stringify({
                    "sysparm_action": "getRecords",
                    "sysparm_query": query
                });
                this.request.get(this.baseUrl + params, function(error, response, body) {
                    restCallbackHandler(error, response, body, callback);
                });
            },
            updateRecord: function(object, callback) {
                var params = querystring.stringify({
                    "sysparm_action": "update",
                    "sysparm_query" : "sys_id=" + object.sys_id
                });
                var opts = {
                    body: JSON.stringify(object)
                };
                this.request.post(this.baseUrl + params, opts, function(error, response, body) {
                    restCallbackHandler(error, response, body, callback);
                });
            },
            updateMultiple: function(object, query, callback) {
                var params = querystring.stringify({
                    "sysparm_action": "update",
                    "sysparm_query" : query
                });
                var opts = {
                    body: JSON.stringify(object)
                };
                this.request.post(this.baseUrl + params, opts, function(error, response, body) {
                    restCallbackHandler(error, response, body, callback);
                });
            },
            insertRecord: function(object, callback) {
                var params = querystring.stringify({
                    "sysparm_action": "insert"
                });
                var opts = {
                    body: JSON.stringify(object)
                };
                this.request.post(this.baseUrl + params, opts, function(error, response, body) {
                    restCallbackHandler(error, response, body, callback);
                });
            },
            insertMultiple: function(objectArray, callback) {
                for(var obj in objectArray) {
                    this.insertRecord(obj, callback);
                }
            },
            deleteRecord: function(object, callback) {
                var params = querystring.stringify({
                    "sysparm_action": "deleteRecord"
                });
                var opts = {
                    body: JSON.stringify({
                        "sysparm_sys_id": object.sys_id
                    })
                };
                this.request.post(this.baseUrl + params, opts, function(error, response, body) {
                    restCallbackHandler(error, response, body, callback);
                });
            },
            deleteMultiple: function(query, callback) {
                var params = querystring.stringify({
                    "sysparm_action": "deleteMultiple",
                    "sysparm_query" : query
                });
                this.request.get(this.baseUrl + params, function(error, response, body) {
                    restCallbackHandler(error, response, body, callback);
                });
            }
        };
    };

    Object.prototype.dotWalk = function(table, callback) {
        returnFunc(table).getRecord(this.toString(), callback);
    };

    return returnFunc;
}
module.exports.SnRestClient = SnRestClient;
