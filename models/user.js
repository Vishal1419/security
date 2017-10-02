var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Licence = require("./licence");
var constants = require('../common/constants');

var userSchema = new Schema({
    name: {type: String, required: true},
    mobile_no: {type: String, required: true},
    licences: [{type: Schema.Types.ObjectId, ref: 'Licence'}]
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getAll = function(callback){
  User.find().sort('name').populate('licences').exec(function(err, users){
    if (err) return callback(err, null);
    callback(null, users);
  });
};
  
module.exports.getById = function(id, callback){
  User.findById(id, function(err, user){
    if(err) return callback(err, null);
    callback(null, user);
  });
};

module.exports.getByName = function(name, callback){
  User.find({name: new RegExp('^'+name+'$', "i")}).sort('name').populate('licences').exec(function(err, users){
    if(err) return callback(err, null);
    callback(null, users);
  });
};

module.exports.getByMobileNo = function(mobile, callback){
    User.find({mobile_no: new RegExp('^'+mobile+'$', "i")}).sort('mobile_no').populate('licences').exec(function(err, mobiles){
      if(err) return callback(err, null);
      callback(null, mobiles);
    });
};

module.exports.getByKey = function(key, callback) {
    User.find().populate('licences').exec(function(err, users) {
		if(err) {
			return callback(err);
		}
		users.some(function(user) {
			return user.licences.some(function(licence) {
				if(licence.key == key) {
					callback(null, user);
					return true;
				}
			}, this);
		}, this);
		// return callback({error: "Invalid Key"});
	});
}

module.exports.createUser = function(user, callback){
    var newUser = new User(user)
    newUser.save(callback);                
};

module.exports.updateUser = function(user, callback){
    User.update(
        {"_id": user._id},
        {"$set": {
                    "name": user.name, 
                    "mobile_no": user.mobile_no, 
                    "licences": user.licences
                }
        },
        {multi: false},
        callback
    );
};

//delete licence will be added if needed as it looks challenging.
//if it will be added then it will active and deactive a key instead of deleting it.
//If a record is deleted then we will not get exact sold and updated number of copies.
