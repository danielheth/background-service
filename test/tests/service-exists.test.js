'use strict';

const test = require('tap').test,
    IS_WINDOWS = require('../../lib/is-windows')(),
    BackgroundService = require('../../index');

test(`we are checking the existance of a generic service`, function(t) {
    t.plan(1);
    var genericServiceName = IS_WINDOWS ? 'Power' : 'systemd-journald';
    var service = new BackgroundService(genericServiceName);
    t.equal(service.exists(), true, `${genericServiceName} which should exis`);
});

test(`we are checking the existance of an unknown service`, function(t) {
    t.plan(1);
    var service = new BackgroundService('ThisServiceDoesNotExist');
    t.equal(service.exists(), false, 'ThisServiceDoesNotExist which should not exist');
});
