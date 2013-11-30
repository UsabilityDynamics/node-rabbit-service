Node.js RabbitMQ Service.

 - Starts or stops a RabbitMQ Service.
 - Provides a programmatic API for managing a RabbitMQ instance.
 - Exposes a programmatic client for managing exchanges and queues.
 - Includes [Rabbit](https://github.com/UsabilityDynamics/node-rabbit-client) for processing distributed jobs.
 - Can be used as a daemonized RabbitMQ service handler.
 - Modular structure for easy prototypal extension.

To start the service via the terminal: `./bin/rabbit-service.js start` or `forever start rabbit-service start`

## Getting Started
Install the module with: `npm install rabbitmq-client -g`

```javascript

// Start Service using default settings
require( 'rabbitmq-client' ).create( function Service() {
  this.log( 'RabbitMQ Service starting.' );

  // Triggered on errors
  this.on( 'server.error', function error_handler( error ) {
   console.log( 'RabbitMQ Service error occured: [%s]', error.message );
  });

  // Triggered when ready
  this.on( 'server.ready', function ready( error, message ) {
    console.log( error ? 'An error occured: [' + error.message + ']' : 'RabbitMQ Service started successfully' );
  });

});

```

## Debugging
The module uses the debug module and emits logs in the "rabbit:service" namespace.

## Constructor Methods
Typically the RabbitMQ Service will be started using the `startService()` method, which is nothing more but a shortcut
to the instantiator. After instantiation the prototypal methods can be used within the constructor's callback to
interact with the created service such as creating Jobs and Workers or defining Exchanges and Queues.

However, Service creation can be bypassed protoypal methods may be accessed directly.

 - startService( [conf], [cb] ): Creates a new instance of RabbitMQ Service using default configuration from package.json
 - createClient( conf, cb ): Creates a new Connection. This is done automatically when service is started.
 - createConsumer( conf, [cb] ):
 - createProducer( conf, [cb] ):

## Service Instance Methods

 - configure( [fn] ): A simple way of adding a method to be called once the Service is started successfully. Same as binding an event to `connection:success`.
 - createClient()
 - registerActivity( name, [cb] ):
 - processTask( name, [cb] ):
 - log()
 - debug()
 - get( key )
 - set( key, value )
 - manage( key, value, [cb] )
 - on( event, [cb] )
 - off( event, [cb] )
 - emit( event, [args...] )

## Service Instance Events

 - service.started
 - service.error

## Command Line Usage
When the Node.js module is installed globally using NPM several CLI commands become available.
If the module was not installed globally you may run `npm link` from within the module.

 - rabbit-service start: Start RabbitMQ Service using default settings extended by command-line arguments.
 - rabbit-service stop: Stop currently running instance of RabbitMQ Service and RabbitMQ.
 - rabbit-service status: Get status of service - used to check if running.
 - rabbit-service restart: Restarts currently running instance of RabbitMQ Service and RabbitMQ.
 - rabbit-service console: Enable console for interfacing with an instance.
 - rabbit-service install: Daemonize RabbitMQ Service.

## Schemas
The schemas are stored in static/schemas and are used for various things, most importantly validation of settings.

## Development

 - grunt build
 - grunt clean:build
 - grunt clean:release

## Troubleshooting

http://localhost:8070/

Manually start RabbitMQ server.
$ vendor/rabbitmq-3.2.0/sbin/rabbitmq-server
$ vendor/rabbitmq-3.2.0-mac/sbin/rabbitmq-server

## RabbitMQ Notes

 - Stored in vendor/rabbitmq-3.2.0
 - Settings are in vendor/rabbitmq-3.2.0/etc/rabbitmq
 - The RabbitMQ configuration file used [Erlang format](http://www.erlang.org/doc/man/config.html).
 - Process has "beam.smp" process name in OSX.
 - If tracing is enabled, logs are stored in "/var/tmp/rabbitmq-tracing". Enabling tracing adds queue, exchange and channels.

## License

(The MIT License)

Copyright (c) 2013 Usability Dynamics, Inc. &lt;info@usabilitydynamics.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OT