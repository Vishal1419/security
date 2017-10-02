var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var licenceSchema = new Schema({
    key: {type: String, required: true},
    hdd: {type: String, required: false},
    is_used: {type: Boolean, required: true},
    updated_times: {type: Number, required: true}
});

var Licence = module.exports = mongoose.model('Licence', licenceSchema);

module.exports.getAll = function(callback){
  Licence.find(function(err, licences){
    if (err) return callback(err, null);
    callback(null, licences);
  });
};

module.exports.getAllUsed = function(callback){
  Licence.find({is_used: true}, function(err, licences){
    if (err) return callback(err, null);
    callback(null, licences);
  });
};

module.exports.getAllUnused = function(callback){
  Licence.find({is_used: false}, function(err, licences){
    if (err) return callback(err, null);
    callback(null, licences);
  });
};

module.exports.getAllUpdated = function(callback){
  Licence.find({updated_times: { $gt : 0 }}, function(err, licences){
    if (err) return callback(err, null);
    callback(null, licences);
  });
};

module.exports.getById = function(id, callback){
  Licence.findById(id, function(err, licence){
    if(err) return callback(err, null);
    callback(null, licence);
  });
};

module.exports.getByKey = function(key, callback){
  Licence.find({key: new RegExp('^'+key+'$', "i")}, function(err, licences){
    if(err) return callback(err, null);
    callback(null, licences);
  });
};

module.exports.getUnusedLicenceCount = function(callback) {
  Licence.count({is_used: false}, function(err, count) {
    if(err) return callback(err, null);
    callback(null, count);
  });
}

module.exports.getDuplicateGeneratedLicences = function(generatedLicences, callback) {
  Licence.find({key: { $in: generatedLicences.map(function(o) { return o.key; }) }}, function(err, foundLicences) {
    if(err) return callback(err, null);
    callback(null, foundLicences);
  });
}

module.exports.createLic = function(newLicence, callback){
  newLicence.save(callback);
};

module.exports.bulkCreateLic = function(licences, callback) {
  // licences.forEach(function(licence) {
  //   licence.save(callback);
  // }, this);
  Licence.collection.insertMany(licences, function(err, result) {
    if(err) return callback(err);
    callback(null, result);
  })
}

module.exports.updateLic = function(licence, callback){
  Licence.update(
    {"_id": licence._id},
    {"$set": {
                "key": licence.key, 
                "hdd": licence.hdd,
                "is_used": licence.is_used,
                "updated_times": licence.updated_times
             }
    },
    {multi: false},
    callback
  );
};

//delete licence will be added if needed as it looks challenging.
//if it will be added then it will active and deactive a key instead of deleting it.
//If a record is deleted then we will not get exact sold and updated number of copies.
