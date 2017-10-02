/**
 * Created by vishal sherathiya on 11/09/17.
 */

var winston = require('winston');

var Logger = function () {

};

Logger.dbLogger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true
        }),
        new (winston.transports.File)({
            name: 'db-error-file',
            colorize: true,
            filename: 'vcc-db-error-file.log',
            maxsize: 2097152,
            level: 'error'
        })
    ]
});

Logger.logDbError = function (error,request) {
    Logger.dbLogger.log(
        error.message,
        {
            request_route:request.route.path,
            request_params:(request.body || request.params),
            query:error
        }
    );
};

module.exports = Logger;
