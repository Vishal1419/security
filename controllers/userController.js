/**
 * Created by vishal sherathiya on 16/09/17.
 */

const rand = require("random-key");
const util = require("util");
const mongoose = require("mongoose");

const SecurityResponse = require('../common/security_response');
const Logger = require('../common/logger');
const licenceModel = require('../models/licence');
const userModel = require('../models/user');
const constants = require('../common/constants');
const config = require('../app_config');

module.exports = {

    save: function (request, response) {

        var security_response = new SecurityResponse(response);

        //Try to get licence key provided by user from licence table in database
        licenceModel.getByKey(request.body.key, function(err, licences){

            if(err) {
                
                console.log(err);

                return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                        .setResponseBody({"error": err})
                                        .send();

            }                
        
            if(licences && licences.length > 0) {
        
                //If user specified licence is found in the database then 
                //check if licence key is used or not
                if(licences[0].is_used) {
                    //Check if licence used hdd and user's current hdd are same
                    if(licences[0].hdd == request.body.hdd) {

                        licenceModel.updateLic({
                            "_id": licences[0]._id, 
                            "key": licences[0].key,
                            "hdd": licences[0].hdd,
                            "is_used": true,
                            "updated_times": licences[0].updated_times + 1
                        }, function(err, updatedLicence) {

                            if(err) {
                                
                                console.log(err);
                
                                return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                                        .setResponseBody({"error": err})
                                                        .send();
                
                            }                

                            userModel.getByKey(request.body.key, function(err, user) {

                                if(err) {

                                    console.log(err);
                                    
                                    return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                                            .setResponseBody({"error": err})
                                                            .send();
                                                        
                                }

                                userModel.updateUser({
                                    _id: user._id,
                                    name: request.body.name,
                                    mobile_no: request.body.mobile_no,
                                    licences: user.licences
                                }, function(err, updatedUser) {

                                    if(err) {
                                        
                                        console.log(err);
                                        
                                        return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                                                .setResponseBody({"error": err})
                                                                .send();
                                                            
                                    }

                                    return security_response.setStatusCode(SecurityResponse.SUCCESS_CODE)
                                                            .setResponseBody({"result": "Licence updated Successfully"})
                                                            .send();

                                });

                            });

                        });
                    } else {
                        //same key is used in another hdd.
                        return security_response.setStatusCode(SecurityResponse.LICENCE_KEY_ERROR)
                                                .setResponseBody({"error": constants.ERROR_MESSAGES.LICENCE_KEY_ALREADY_IN_USE})
                                                .send();
                    }
                } else {
                    //If licence key is found but is never used, then 
                    // check if user already exists by mobile no
                    userModel.getByMobileNo(request.body.mobile_no, function(err, users) {

                        if(err) {
                            
                            console.log(err);
            
                            return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                                    .setResponseBody({"error": err})
                                                    .send();
            
                        }                

                        if(users && users.length > 0) {
                            //user exists. Means existing user purchased a new licence

                            var lic = {
                                "_id": licences[0]._id,
                                "key": licences[0].key,
                                "hdd": request.body.hdd,
                                "is_used": true,
                                "updated_times": 0
                            }

                            licenceModel.updateLic(lic, function(err, updatedLicence) {

                                if(err) {
                                    
                                    console.log(err);
                    
                                    return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                                            .setResponseBody({"error": err})
                                                            .send();
                    
                                }                

                                console.log("++++++++++++++++++++");
                                console.log(lic);
                                console.log(util.inspect(users, {showHidden: false, depth: null}))

                                var new_licences = users[0].licences;
                                new_licences.push(mongoose.Types.ObjectId(lic._id));

                                userModel.updateUser({
                                    "_id": users[0]._id, 
                                    "name": users[0].name,
                                    "mobile_no": users[0].mobile_no, 
                                    "licences": new_licences, 
                                }, function(err, updatedUser) {

                                    if(err) {
                                        
                                        console.log(err);
                        
                                        return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                                                .setResponseBody({"error": err})
                                                                .send();
                        
                                    }                

                                    return security_response.setStatusCode(SecurityResponse.SUCCESS_CODE)
                                                            .setResponseBody({"result": "New Licence assigned to Existing User."})
                                                            .send();
    
                                });        
                            });
                        } else {
                            //user does not exist.
                            //Create a new user

                            console.log(licences);

                            var lic = {  
                                "_id": licences[0]._id,
                                "key": licences[0].key,
                                "hdd": request.body.hdd,
                                "is_used": true,
                                "updated_times": 0
                            };

                            licenceModel.updateLic(lic, function(err, updatedLic) {

                                if(err) {
                                    
                                    console.log(err);
                    
                                    return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                                            .setResponseBody({"error": err})
                                                            .send();
                    
                                }                

                                var user = {
                                    name: request.body.name,
                                    mobile_no: request.body.mobile_no,
                                    licences: []
                                }

                                user.licences.push(mongoose.Types.ObjectId(lic._id));

                                console.log("----------------------");
                                console.log(user);

                                userModel.createUser(user, function(err, result) {

                                    if(err) {
                                        
                                        console.log(err);
                        
                                        return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                                                .setResponseBody({"error": err})
                                                                .send();
                        
                                    }                
    
                                    return security_response.setStatusCode(SecurityResponse.SUCCESS_CODE)
                                                            .setResponseBody({"result": "New user created"})
                                                            .send();

                                });                                
                            });
                        }
                    });
                }
            } else {
                //Licence key does not exist in database.
                return security_response.setStatusCode(SecurityResponse.LICENCE_KEY_ERROR)
                                        .setResponseBody({"error": constants.ERROR_MESSAGES.INVALID_LICENCE_KEY})
                                        .send();

            }
        });

    },

    getAll: function(request, response) {

        var security_response = new SecurityResponse(response);
        
        userModel.getAll(function(err, users) {
    
            if(err) {
                
                console.log(err);
    
                return security_response.setStatusCode(SecurityResponse.DATABASE_ERROR)
                                        .setResponseBody({"error": err})
                                        .send();
    
            }
                
            security_response.setStatusCode(SecurityResponse.SUCCESS_CODE)
                             .setResponseBody({"users": users})
                             .send();
    
        });
    
    }

};