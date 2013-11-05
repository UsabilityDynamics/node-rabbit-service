/**
 * RabbitMQ Service API Tests
 *
 *
 */
module.exports = {

  "RabbitMQ API": {

    // Record module loading time
    "can load module": function() {
      this.timeout( 150 );
      require( '../' );
    },

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
      // require.resolve( 'rabbitmq-service-stop' );

      // Check resolution
      require.resolve( 'rabbitmq-service' );
      require.resolve( 'rabbitmq-service/bin/rabbitmq-service-stop.js' );
      require.resolve( 'rabbitmq-service/bin/rabbitmq-service-console.js' );
      require.resolve( 'rabbitmq-service/bin/rabbitmq-service-start.js' );

    },

    // Check contents of package.json's "config" object
    "has default settings.": function() {

      var config = require( '../package.json' ).config;

      config.should.have.property( 'port' );
      // config.should.have.property( 'address' );

    }

  }

};