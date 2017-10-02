const Restify = require('restify');
const winston = require('winston');

const SecurityResponse = require('./common/security_response');
// const SecurityCron = require('./common/security_cron');
const Utility = require('./common/utility');
const config = require('./app_config');

require('./db');
require('./prototypes/array');

var server = Restify.createServer({
    name: 'Security',
    versions: ['1.0.0']
});

server.use(Restify.plugins.queryParser());
server.use(Restify.plugins.jsonBodyParser());

require('./routes/licence')(server);
require('./routes/user')(server);

//winston.handleExceptions(new winston.transports.File({ filename: 'exceptions.log' }))
// var routes = require('./routes')(server);

server.listen(config.ENV_CONFIG.server.port,config.ENV_CONFIG.server.ip,function(err){
    console.log("Server Url : "+server.url);
    // SecurityCron.sharedInstance().startSecurityCron();
});
