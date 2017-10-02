/**
 * Created by vishal sherathiya on 11/09/17.
 */

const validator = require('isvalid');
var SecurityResponse = require('./security_response');

var AppUtils = function (){};

AppUtils.validateRequest = function(schema, errorCallback){
    return function validate(request, response, next){
        validator((request.body || request.params),
            schema,
            function(err){
                if(!err) {
                    next();
                }else {
                    if(errorCallback !== undefined){
                        errorCallback(request, response);
                    }

                    var customResponse = new SecurityResponse(response);
                    customResponse.setStatusCode(err.message.errorCode)
                        .setResponseBody({error: err.message.message})
                        .send();
                }
            }
        );
    };
};

AppUtils.validateParams = function (params, schema, request, response, next, errorCallback) {
    validator(params,
        schema,
        function (error) {
            if(!error){
                next();
            }else{
                if(errorCallback != undefined){
                    errorCallback(request, response);
                }

                var customResponse = new SecurityResponse(response);
                customResponse.setStatusCode(error.message.errorCode)
                    .setResponseBody({error: error.message.message})
                    .send();
            }
        });
};

module.exports = AppUtils;
