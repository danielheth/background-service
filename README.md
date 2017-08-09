[![Build Status](https://travis-ci.org/danielheth/background-service.svg?branch=master)](https://travis-ci.org/danielheth/background-service)

# Background Service

Abstracts the platform specific workflows for controlling native operating system services.
For Windows we rely on the `sc` command while on systemd based Linux systems we rely on `systemctl`.

## Supported Operating Systems

This module is designed to run on newer Windows Servers and Workstations as well as Cent OS 7 or above.

## Functionality Provided

For any of these simple calls, `stop()`, `start()`, `delete()`, `exists()`, or `state()`, if a problem occurs we will throw an error.  Thus it wouldn't hurt to wrap these calls in a try-catch when using.

### Stop Service

This allows you to specify a service name and top that service if it exists.  We also validate the stopped state once the command has been issued.

```javascript
var service = new BackgroundService('Power');
service.stop();
console.log('Power service is now stopped');
```

### Start Service

This functionality allows you to start a service by name.  We validate the started state afterwards and return when it is ready.

```javascript
var service = new BackgroundService('Power');
service.start();
console.log('Power service is now running');
```

### Start Service

This functionality allows you to start a service by name.  We validate the started state afterwards and return when it is ready.

```javascript
var service = new BackgroundService('Power');
service.delete();
console.log('Power service has been deleted');
```

### Service Exists

Returns a simple boolean of if the service exists as registered by the operating system.

```javascript
var service = new BackgroundService('Power');
var serviceExists = service.exists();
if (serviceExists) {
    console.log('Power service does exist');
}
```

### Service State

Returns one of the properties stated in lib/service-states... RUNNING, STOPPED, or UNKNOWN

```javascript
const SERVICE_STATES = require('./lib/service-states');
var service = new BackgroundService('Power');
var serviceState = service.state();
if (serviceState === SERVICE_STATES.RUNNING) {
    console.log('Power service is running');
}
```
