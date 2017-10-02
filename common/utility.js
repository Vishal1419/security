/**
 * Created by vishal sherathiya on 11/09/17.
 */

var crypto = require("crypto");

var Utility = function () {};

Utility.encryptText = function(text, algorithm, key) {
    var cipher = crypto.createCipher(algorithm, key);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
};

Utility.decryptText = function(encryptedText, algorithm, key) {
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

Utility.isNull = function (value) {
    if(value === null || value === undefined){
        return true;
    }

    return false;
};

module.exports = Utility;