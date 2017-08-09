'use strict';

const execSync = require('child_process').execSync,
    waitUntil = require('wait-until'),
    SERVICE_STATES = require('./service-states');

function BackgroundService(serviceName) {
    this.serviceName = serviceName;
    this.startCmd = null;
    this.stopCmd = null;
    this.deleteCmd = null;

    this.stop = function() {
        var state = this.state(serviceName);
        if (state !== SERVICE_STATES.STOPPED) {
            console.log('Stopping ', this.serviceName);
            try {
                var output = execSync(this.stopCmd, {stdio: 'pipe'});
                var firstLine = output.toString().split('\n')[0];
                console.log(firstLine);

                waitUntil()
                    .interval(1000)
                    .times(30)
                    .condition(() => {
                        return this.state(this.serviceName) === SERVICE_STATES.STOPPED;
                    });

            } catch (err) {
                var errMsg = err.stderr.toString();
                if (!errMsg.includes(`The ${this.serviceName} service is not started.`)) {
                    throw err;
                }
            }
        }
        return true;
    };

    this.start = function() {
        var state = this.state(this.serviceName);
        if (state !== SERVICE_STATES.RUNNING) {
            console.log('Starting ', this.serviceName);
            try {
                var output = execSync(this.startCmd, {stdio: 'pipe'});
                var firstLine = output.toString().split('\n')[0];
                console.log(firstLine);

                waitUntil()
                    .interval(1000)
                    .times(30)
                    .condition(() => {
                        return this.state(this.serviceName) === SERVICE_STATES.RUNNING;
                    });

            } catch (err) {
                var errMsg = err.stderr.toString();
                if (!errMsg.includes(`The ${this.serviceName} service is not stopped.`)) {
                    throw err;
                }
            }
        }
        return true;
    };

    this.delete = function() {
        var state = this.state(this.serviceName);
        if (state !== SERVICE_STATES.RUNNING) {
            console.log('Deleting ', this.serviceName);
            try {
                var output = execSync(this.deleteCmd, {stdio: 'pipe'});
                var firstLine = output.toString().split('\n')[0];
                console.log(firstLine);

                waitUntil()
                    .interval(1000)
                    .times(30)
                    .condition(() => {
                        return this.serviceExists(this.serviceName) === false;
                    });

            } catch (err) {
                var errMsg = err.stderr.toString();
                if (!errMsg.includes(`The ${this.serviceName} service is not stopped.`)) {
                    throw err;
                }
            }
        }
        return true;
    };

    this.exists = function() {
        throw new Error('exists is not implemented');
    };

    this.state = function() {
        throw new Error('state is not implemented');
    };

};

module.exports = BackgroundService;
