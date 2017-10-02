/**
 * Created by vishal sherathiya on 11/09/17.
 */

var winston = require('winston');

var securityDevelopment = {
    db: {
        "database": "security",
        "host": "127.0.0.1",
        "port": 27017,
    },
    server:{
        ip:"192.168.0.2",
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
        "host": "127.0.0.1",
        "port":27017,
    },
    server:{
        ip:"139.59.18.253",
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

module.exports.ENV_CONFIG = securityProduction;