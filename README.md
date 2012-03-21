## Simple app for Cloud Foundry that uses sockets and sticky sessions ##

Sticky sessions are provided with JSESSIONID cookie variable and using RedisStore.

    vmc push app-name
    vmc instances app-name 2

Example on Cloud Foundry with 2 instances: [http://sticky-node-socket-app.cloudfoundry.com](http://sticky-node-socket-app.cloudfoundry.com)
