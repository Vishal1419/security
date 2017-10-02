/**
 * Created by vishal sherathiya on 11/09/17.
 */

var winston = require('winston');

var securityDevelopment = {
    db: {
        "database": "security",
        "host": "192.168.100.204",
        "port": 27017,
    },
    server:{
        ip:"192.168.0.4",
        port:8888
    },
    logger:{
        transports:[
            new (winston.transports.Console)({
                colorize:true
            }),
            new (winston.transports.File)({
                name: 'db-error-file',
                colorize: true,
                filename: 'vcc-db-error-file.log',
                maxsize: 2097152,
                level: 'error'
            })
        ]
    },
    maximumGeneratedKeys: 10
};

var securityProduction = {
    db: {
        "database": "security",
        "host": "192.168.100.204",
        "port":3306,
    },
    server:{
        ip:"192.168.0.4",
        port:8888
    },
    logger:{
        transports:[
            new (winston.transports.Console)({
                colorize:true
            }),
            new (winston.transports.File)({
                name: 'db-error-file',
                colorize: true,
                filename: 'vcc-db-error-file.log',
                maxsize: 2097152,
                level: 'error'
            })
        ]
    },
    maximumGeneratedKeys: 10
};

module.exports.ENV_CONFIG = securityDevelopment;