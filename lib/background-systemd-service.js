'use strict';

const BackgroundService = require('./background-service'),
    execSync = require('child_process').execSync,
    SERVICE_STATES = require('./service-states');

function BackgroundSystemdService(serviceName) {
    BackgroundService.call(this, serviceName);

    this.stopCmd = `systemctl stop "${serviceName}"`;
    this.startCmd = `systemctl start "${serviceName}"`;

    this.exists = function() {
        try {
            var output = execSync(`systemctl status "${this.serviceName}" | grep "Active:"`, { stdio: 'pipe' });
            if (output.toString().indexOf('Active:') < 0) {
                throw new Error('Unexpected result has occurred');
            }
            return true; //on systemd this command succeeds when the service does exist
        } catch (err) {
            return false; //on systemd an error is thrown when service does not exist
        }
    };

    this.state = function() {
        try {
            var output = execSync(`systemctl status "${this.serviceName}" | grep "Active:"`, { stdio: 'pipe' });
            var words = output.toString().trim().split(' ');
            var state = words[2].replace('(', '').replace(')', '');
            switch (state.toLowerCase()) {
                case 'waiting':
                case 'running':
                    return SERVICE_STATES.RUNNING;
                case 'dead':
                case 'exited':
                    return SERVICE_STATES.STOPPED;
                default:
                    return SERVICE_STATES.UNKNOWN;
            }
        } catch (err) {
            var errMsg = err.stderr.toString();
            console.log('err: ', errMsg);
            return SERVICE_STATES.UNKNOWN;
        }
    };
}

BackgroundSystemdService.prototype = Object.create(BackgroundService.prototype);

module.exports = BackgroundSystemdService;
