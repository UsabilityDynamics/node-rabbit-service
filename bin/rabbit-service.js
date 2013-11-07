#!/usr/bin/env node

module.rabbit     = require( '../' );
module.commander  = require( 'commander' );

module.commander
  .version( module.rabbit.version )
  .option( '-d, --debug <debug>', 'enable debugging' )

// Start Module
module.commander
  .command( 'start' ).description( 'start Rabbit service' )
  .option( '-n, --name <name>', 'set name', 'rabbit-service' )
  .option( '-c, --cluster <cluster>', 'set cluster', 'rabbit-cluster' )
  .option( '-u, --url <url>', 'service MQ URI.', 'amqp://localhost:5672/' )
  .option( '-m, --management <management>', 'service management URL.', 'localhost:15672' )
  .action( function( options ) {

    module.rabbit.create( function Service( error ) {
      this.log( 'Starting Rabbit Service.' );

      this.set( 'settings.name', options.name );
      this.set( 'settings.environment', process.env.NODE_ENV || 'production' );
      this.set( 'settings.cluster', options.cluster );
      this.set( 'settings.url', options.url );

      // Triggered on errors
      this.on( 'server.error', function error_handler( error ) {
        console.log( 'RabbitMQ Service error occured: [%s]', error.message, error );
      });

      // Server crash
      this.on( 'server.exit', function error_handler() {
        console.log( 'Rabbit Service exited.' );
      });

      // Triggered when ready
      this.once( 'server.ready', function ready( error, data ) {
        console.log( error ? 'An error occured: [' + error.message + ']' : 'RabbitMQ Service started successfully.', data.pid );
      });

    });

  });

// Stop Module
module.commander
  .command( 'stop' ).description( 'stop module' )
  .option( '-f, --force', 'Force stop.' )
  .action( function( options ) {});

module.commander
  .parse( process.argv );
