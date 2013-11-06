/*
 * Basic Example
 *
 */

// Start Service
require( 'rabbit-service' ).create( function Service() {
  this.log( 'RabbitMQ Service started.' );

  // Triggered on errors
  this.on( 'error', function error_handler( error ) {
    console.log( 'An error occured: [%s]', error.message );
  });

  // Triggered when ready
  this.on( 'ready', function ready( error, message ) {
    console.log( error ? 'An error occured: [' + error.message + ']' : 'RabbitMQ Client started successfully' );
  });

});