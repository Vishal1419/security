/**
 * Created by vishal sherathiya on 11/09/17.
 */

function SecurityResponse(response){
    this.statusCode = 1001;
    this.body = [];
    this.response = response;
}

SecurityResponse.SUCCESS_CODE = 1000;
SecurityResponse.UNKNOWN_ERROR= 1001;
SecurityResponse.DATABASE_ERROR = 1002;
SecurityResponse.LICENCE_KEY_ERROR = 1003;

SecurityResponse.prototype.setStatusCode = function (statusCode) {
    this.statusCode = statusCode;
    return this;
};

SecurityResponse.prototype.setResponseBody = function (responseBody) {
    this.body = responseBody;
    return this;
};

SecurityResponse.prototype.send = function () {
    var responseBody = {
        statusCode: this.statusCode
    };

    for (var key in this.body) {
        responseBody[key] = this.body[key];
    }

    this.response.send(responseBody);
};

module.exports = SecurityResponse;
