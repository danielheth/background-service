'use strict';

let os = require('os');

module.exports = function isWindows() {
    return os.platform() === 'win32';
};
