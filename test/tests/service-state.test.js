'use strict';

const test = require('tap').test,
    IS_WINDOWS = require('../../lib/is-windows')(),
    SERVICE_STATES = require('../../lib/service-states'),
    BackgroundService = require('../../index');

test(`we are properly reading the state of a generic service`, function(t) {
    t.plan(1);
    var genericServiceName = IS_WINDOWS ? 'Power' : 'systemd-journald';
    var service = new BackgroundService(genericServiceName);
    t.equal(service.state(), SERVICE_STATES.RUNNING, `${genericServiceName} which should be RUNNING`);
});

test(`we are properly reading the state of an unknown service`, function(t) {
    t.plan(1);
    var service = new BackgroundService('ThisServiceDoesNotExist');
    t.equal(service.state(), SERVICE_STATES.UNKNOWN, 'ThisServiceDoesNotExist which should be UNKNOWN');
});

test(`we are properly reading the state of an generic service`, function(t) {
    t.plan(1);
    var genericServiceName = IS_WINDOWS ? 'fhsvc' : 'systemd-sysctl';
    var service = new BackgroundService(genericServiceName);
    t.equal(service.state(), SERVICE_STATES.STOPPED, `${genericServiceName} which should be STOPPED`);
});
