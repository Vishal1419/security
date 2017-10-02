/**
 * Created by vishal sherathiya on 16/09/17.
 */

const rand = require("random-key");

const SecurityResponse = require('../common/security_response');
const Logger = require('../common/logger');
const licenceModel = require('../models/licence');
const config = require('../app_config');

function getLicences(request, response, funcNameToCall) {

    var security_response = new SecurityResponse(response);
    
    licenceModel[funcNameToCall](function(err, licences) {

        if(err) {
            
            console.log(err);

            return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                    .setResponseBody({"error": err})
                                    .send();

        }
            
        security_response.setStatusCode(SecurityResponse.SUCCESS_CODE)
                         .setResponseBody({"licences": licences})
                         .send();

    });

}

module.exports = {

    generateKeys: function (request, response) {

        var security_response = new SecurityResponse(response);

        licenceModel.getUnusedLicenceCount(function(err, count) {
            
            if(err) {

                console.log(err);

                return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                        .setResponseBody({"error": err})
                                        .send();

            }

            var generatedLicences = [];
            for(var i = 1; i <= config.ENV_CONFIG.maximumGeneratedKeys - count; i++) {
                var licence = {
                    key: rand.generateBase30(25),
                    hdd: null,
                    is_used: false,
                    updated_times: 0
                }
                generatedLicences.push(licence);
            }
            
            licenceModel.getDuplicateGeneratedLicences(generatedLicences, function(err, licences) {

                if(err) {
                    
                    console.log(err);
    
                    return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                            .setResponseBody({"error": err})
                                            .send();
    
                }
                    
                licences.forEach(function(licence) {
                    generatedKeys.remByVal(licence);
                }, this);

                if(generatedLicences.length > 0) {

                    licenceModel.bulkCreateLic(generatedLicences, function(err, result) {

                        if(err) {
            
                            console.log(err);
            
                            return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                                    .setResponseBody({"error": err})
                                                    .send();
            
                        }
                            
                        security_response.setStatusCode(SecurityResponse.SUCCESS_CODE)
                                         .setResponseBody(result.result)
                                         .send();

                        });
                
                } else {

                    security_response.setStatusCode(SecurityResponse.SUCCESS_CODE)
                                     .setResponseBody({'n': 0})
                                     .send();

                }

            });

        });

    },

    getAll: function (request, response) {
        getLicences(request, response, "getAll");
    },

    getAllUsed: function (request, response) {
        getLicences(request, response, "getAllUsed");
    },

    getAllUnused: function (request, response) {
        getLicences(request, response, "getAllUnused");
    },

    getAllUpdated: function (request, response) {
        getLicences(request, response, "getAllUpdated");
    },

    getLicenceKeyFromHDD: function(request, response) {
        var crypto = {
            'A': 'E', 'B': 'X', 'C': 'W', 'D': 'T', 'E': '0', 'F': 'R', 'G': 'S', 
            'H': 'U', 'I': 'P', 'J': 'G', 'K': 'I', 'L': '2', 'M': '3', 'N': 'A', 
            'O': 'K', 'P': '4', 'Q': 'Y', 'R': '5', 'S': 'Z', 'T': '6', 'U': 'C', 
            'V': 'J', 'W': '7', 'X': 'O', 'Y': '9', 'Z': 'V',
            '1': 'B', '2': 'H', '3': '8', '4': 'Q', '5': 'M', '6': 'D', '7': '1', 
            '8': 'N', '9': 'F', '0': 'L' 
        }
        
        var key = request.body.key;
        var hdd = request.body.hdd;
        var algo = require('md5');

        var licence = key + hdd;
        var encryptedLic = '';
        licence.split('').forEach(function(character) {
            encryptedLic += algo(crypto[crypto[crypto[character]]]);
        }, this);

        var security_response = new SecurityResponse(response);
    
        security_response.setStatusCode(SecurityResponse.SUCCESS_CODE)
                         .setResponseBody({'licence': encryptedLic})
                         .send();
    }

};