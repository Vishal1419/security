/**
 * Created by vishal sherathiya on 11/09/17.
 */

const moment = require('moment');
const CronJob = require('cron').CronJob;

var sharedInstanceObj;

function SecurityCron() {
    this.generateKeyCronJob = null;
}

SecurityCron.sharedInstance = function () {
    if (!sharedInstanceObj) {
        sharedInstanceObj = new SecurityCron();
    }
    return sharedInstanceObj;
};

SecurityCron.prototype.startSecurityCron = function () {
    this.generateKeyCronJob = new CronJob({
        cronTime: '* * * * *',
        onTick: function() {
            console.log(moment().format("DD-MM-YYYY HH:mm"));
            //My function for generating keys will be called here
        },
        start: false
    });
    this.generateKeyCronJob.start();
};

module.exports = SecurityCron;