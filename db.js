const mongoose = require('mongoose');
const config = require('./app_config');

mongoose.connect('mongodb://' + config.ENV_CONFIG.db.host + ':'
                              + config.ENV_CONFIG.db.port + '/security');
