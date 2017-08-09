'use strict';

const IS_WINDOWS = require('./lib/is-windows')(),
    systemdService = require('./lib/background-systemd-service'),
    windowsService = require('./lib/background-windows-service');

module.exports = function(serviceName) {
    return IS_WINDOWS ? new windowsService(serviceName) : new systemdService(serviceName);
};
