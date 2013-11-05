/**
 * RabbitMQ Client API Tests
 *
 *
 */
module.exports = {

  "RabbitMQ Client": {

    // Check Module Structure
    "has expected methods.": function() {

      var client = require( '../' );

      // Constructor Methods
      client.should.have.ownProperty( 'debug' );
      client.should.have.ownProperty( 'getInstance' );
      client.should.have.ownProperty( 'startService' );
      client.should.have.ownProperty( 'createClient' );
      client.should.have.ownProperty( 'create' );

      // Instance Methods
      client.prototype.should.have.ownProperty( 'log' );
      client.prototype.should.have.ownProperty( 'debug' );
      client.prototype.should.have.ownProperty( 'createClient' );
      client.prototype.should.have.ownProperty( 'registerJob' );
      client.prototype.should.have.ownProperty( 'runJob' );
      client.prototype.should.have.ownProperty( 'manage' );
      client.prototype.should.have.ownProperty( 'configure' );

      // Utility Methods (inherited from abstract module)
      client.utility.should.have.ownProperty( 'realpath' );
      client.utility.should.have.ownProperty( 'defaults' );
      client.utility.should.have.ownProperty( 'auto' );
      client.utility.should.have.ownProperty( 'queue' );
      client.utility.should.have.ownProperty( 'values' );
      client.utility.should.have.ownProperty( 'toArray' );
      client.utility.should.have.ownProperty( 'where' );
      client.utility.should.have.ownProperty( 'query' );
      client.utility.should.have.ownProperty( 'console' );
      client.utility.should.have.ownProperty( 'extend' );
      client.utility.should.have.ownProperty( 'noop' );

      // Extra Utility Methods
      client.utility.should.have.ownProperty( 'validate' );
      client.utility.should.have.ownProperty( 'inherits' );
      client.utility.should.have.ownProperty( 'settings' );
      client.utility.should.have.ownProperty( 'emitter' );
      client.utility.should.have.ownProperty( 'request' );

    },

    // Check that Module is installed properly
    "is installed.": function() {

      var fs = require( 'fs' );

      if( !fs.existsSync( './.dynamic' ) ) {
        throw new Error( 'The .dynamic directory does not exist.' )
      }

      // Check global binaries
      // require.resolve( 'rabbitmq-client-stop' );

      // Check resolution
      require.resolve( 'rabbitmq-client' );
      require.resolve( 'rabbitmq-client/bin/rabbitmq-client-stop.js' );
      require.resolve( 'rabbitmq-client/bin/rabbitmq-client-console.js' );
      require.resolve( 'rabbitmq-client/bin/rabbitmq-client-start.js' );

    },

    // Check contents of package.json's "config" object
    "has default settings.": function() {

      var config = require( '../package.json' ).config;

      config.should.have.property( 'port' );
      // config.should.have.property( 'address' );

    },

    // Try to start the service
    "can start service.": function( done ) {

      this.timeout( 10000 );

      /**
       * Defnes custom service handler
       *
       * @param error
       * @param prototype
       */
      function serviceHandler( error, prototype ) {

        if( error ) {
          console.log( 'serviceHandler error', error );
        }

        this.should.have.property( 'log' );
        this.should.have.property( 'on' );
        this.should.have.property( 'off' );
        this.should.have.property( 'get' );
        this.should.have.property( 'set' );

        prototype.should.have.property( 'log' );
        prototype.should.have.property( 'on' );
        prototype.should.have.property( 'off' );
        prototype.should.have.property( 'get' );
        prototype.should.have.property( 'set' );

        //done();

      }

      var service = require( '../' ).startService({
        "name": "rabbit-test",
        "port": 1300,
        "default_vhost": "/test"
      }, serviceHandler );

      // Inherited Properties
      service.should.have.property( 'get' );
      service.should.have.property( 'set' );
      service.should.have.property( 'log' );
      service.should.have.property( 'debug' );
      service.should.have.property( 'createProducer' );
      service.should.have.property( 'createConsumer' );
      service.should.have.property( 'createClient' );
      service.should.have.property( 'registerJob' );
      service.should.have.property( 'runJob' );
      service.should.have.property( 'manage' );
      service.should.have.property( 'configure' );

      // Instance Properties
      service.get().should.have.ownProperty( 'id' );
      service.get().should.have.ownProperty( 'settings' );
      service.get().should.have.ownProperty( 'validation' );
      service.get( 'process' ).should.have.ownProperty( 'pid' );

    },

    "monitors CLI output.": function() {},

    "can stop service.": function() {}

  }

};