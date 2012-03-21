## Simple app for Cloud Foundry that uses sockets and sticky sessions ##

Sticky sessions are provided with JSESSSIONID cookie variable and using RedisStore.

    vmc push app-name
    vmc instances app-name 2