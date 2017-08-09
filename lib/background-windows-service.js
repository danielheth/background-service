'use strict';

const BackgroundService = require('./background-service'),
    execSync = require('child_process').execSync,
    SERVICE_STATES = require('./service-states');

function BackgroundWindowsService(serviceName) {
    BackgroundService.call(this, serviceName);

    this.stopCmd = `net stop "${serviceName}"`;
    this.startCmd = `net start "${serviceName}"`;
    this.deleteCmd = `sc delete "${serviceName}"`;

    this.exists = function() {
        try {
            var output = execSync(`sc query "${this.serviceName}" | findstr "specified service does not exist"`, {stdio: 'pipe'});
            if (output.toString().trim() !== 'The specified service does not exist as an installed service.') {
                throw new Error('Unexpected result has occurred');
            }
            return false;
        } catch (err) {
            return true;
        }
    };

    this.state = function() {
        try {
            var output = execSync(`sc query "${this.serviceName}" | findstr "STATE"`, {stdio: 'pipe'});
            var words = output.toString().trim().split(' ');
            return words[words.length - 1];
        } catch (err) {
            var errMsg = err.stderr.toString();
            if (errMsg.trim() !== '') {
                console.log('err: ', errMsg);
            }
            return SERVICE_STATES.UNKNOWN;
        }
    };

}

BackgroundWindowsService.prototype = Object.create(BackgroundService.prototype);

module.exports = BackgroundWindowsService;
