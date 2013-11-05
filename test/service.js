/**
 * RabbitMQ Client API Tests
 *
 *
 */
module.exports = {

  "RabbitMQ Service": {

    // Try to start the service
    "can be started.": function( done ) {

      this.timeout( 10000 );

      /**
       * Defnes custom service handler
       *
       * @param error
       * @param prototype
       */
      function serviceHandler( error, prototype ) {

        var serivce = this;

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

        this.on( 'service.exit', function() {
          done();
        });

        setTimeout( function() {
          serivce.stop();
        }, 2000 )

      }

      var service = require( '../' ).startService({
        "name": "rabbit-test",
        "port": 1300,
        "default_vhost": "/test"
      }, serviceHandler );

      // service.on( '**', function() { console.log( 'event', this.event, arguments ); });

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

    "outputs CLI events as events.": function() {},

    "can be stopped.": function() {}

  }

};