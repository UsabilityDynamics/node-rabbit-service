/**
 * RabbitMQ Service Constructor
 *
 * @class RabbitMQ
 * @constructor
 * @version 3.2.0
 * @async
 *
 * @param settings {Object} Configuration settings.
 * @param callback {Function} Callback function.
 *
 * @returns {RabbitMQ}
 * @constructor
 */
function RabbitMQ() {
  this.debug( 'Creating service with [%s].', 'function' === typeof child ? child.name : typeof child );

  var settings  = 'object' === typeof arguments[0] ? arguments[0] : {};
  var callback  = 'function' === typeof arguments[1] ? arguments[1] : RabbitMQ.utility.noop;
  var self      = this;

  // Extend child's prototype with RabbitMQ, Object Emitter and Object Settings
  RabbitMQ.utility.inherits( callback, RabbitMQ );

  try {

    // Until the callback is instantiated we refere to its prototype
    self = callback.prototype;

    RabbitMQ.utility.emitter.mixin( self);
    RabbitMQ.utility.settings.mixin( self  );

    // Extend settings with defaults
    self.set( 'settings', RabbitMQ.utility.defaults( settings, require( '../package' ).config ) );

    // Compute absolute paths to directories
    RabbitMQ.utility.each( self.get( 'settings.directories' ), function( value, key ) {
      self.set( 'settings.directories.' + key, RabbitMQ.utility.realpath( value ) || RabbitMQ.utility.realpath( '../.dynamic/' + key ) )
    });

    // Validate Settings
    self.set( 'validation', RabbitMQ.utility.validate( self.get( 'settings' ), RabbitMQ._schemas.service ) );

    // Prepare PID
    self.set( 'pid', undefined );

    // Validate Settings
    if( !self.get( 'validation' ).is_valid ) {
      throw new Error( 'Validation Failure: ' + validation.errors.join() );
    }

    // Generate Instance ID from settings
    self.set( 'id', RabbitMQ.utility.hash( self.get( 'settings' ) ) );

    // Instantaite the callback
    self = RabbitMQ._instance[ self.get( 'id' ) ] = new callback( null, self );

    self.process = RabbitMQ.utility.spawn( 'ls', [], {
      cwd: process.cwd(),
      env: process.env,
      detached: false
    });

    // Try to parse JSON, Output Data
    self.process.stdout.on( 'data', function( data ) {
      self.log( 'data', data.toString() );
    });

    // Try to parse JSON, Output Error
    self.process.stderr.on( 'data', function( data ) {
      self.log( 'error', data.toString() );
    });

    // Set PID
    self.set( 'pid', self.process.pid );

    // @chainable
    return self;

  } catch( error ) {
    console.error( error.message );
    return self;
  }

  return self;

}

/**
 * Instance Properties
 *
 */
Object.defineProperties( RabbitMQ.prototype, {
  log: {
    /**
     * Log Entry
     *
     * @method log
     * @uses winston
     * @for RabbitMQ.prototype
     */
    value: function log() {
      return console.log.apply( console, arguments );
      return require( 'winston' ).log.apply( null, arguments )
    },
    enumerable: true
  },
  debug: {
    /**
     * Debug Entry
     *
     * @method debug
     * @for RabbitMQ.prototype
     */
    value: require( 'debug' )( 'rabbitmq:lient' ),
    enumerable: true
  },
  createClient: {
    /**
     * Create Client
     *
     * @method createClient
     * @for RabbitMQ.prototype
     */
    value: function createClient() {

    },
    enumerable: true
  },
  registerJob: {
    /**
     * Create Job
     *
     * @method registerJob
     * @for RabbitMQ.prototype
     */
    value: function registerJob() {

    },
    enumerable: true
  },
  runJob: {
    /**
     * Create Job
     *
     * @method registerJob
     * @for RabbitMQ.prototype
     */
    value: function registerJob() {

    },
    enumerable: true
  },
  manage: {
    /**
     * Create Job
     *
     * @method registerJob
     * @for RabbitMQ.prototype
     */
    value: function registerJob() {

    },
    enumerable: true
  },
  configure: {
    /**
     * Create Configuration Callback
     *
     * @method configure
     * @for RabbitMQ.prototype
     */
    value: function configure() {

    },
    enumerable: true
  }
});

/**
 * Constructor Properties
 *
 */
Object.defineProperties( module.exports = RabbitMQ, {
  create: {
    /**
     * Create Instance
     *
     * @method create
     * @for RabbitMQ
     */
    value: function create( settings, callback ) {
      return new RabbitMQ( settings, callback );
    },
    enumerable: false
  },
  debug: {
    /**
     * Constructor Debugger
     *
     * @method debug
     * @for RabbitMQ
     */
    value: require( 'debug' )( 'rabbitmq:constructor' ),
    enumerable: true
  },
  destroy: {
    /**
     * Destroy Instance
     *
     * @method create
     * @for RabbitMQ
     */
    value: function destroy( pid ) {
      RabbitMQ.debug( 'destroy [%s]', pid );
    },
    enumerable: true
  },
  utility: {
    /**
     * Utility Methods
     *
     * @for RabbitMQ
     */
    value: require( './utility' ),
    enumerable: false
  },
  startService: {
    /**
     * Create Instance
     *
     * @method create
     * @for RabbitMQ
     */
    value: function startService( settings, callback ) {
      return RabbitMQ.create( settings, callback );
    },
    enumerable: true
  },
  createClient: {
    /**
     * Create Generic Client
     *
     * @method createClient
     * @for RabbitMQ
     */
    value: function createClient( settings, callback ) {
      console.log( 'asdf' );
    },
    enumerable: true
  },
  getInstance: {
    /**
     * Get Instance by PID
     *
     * @method create
     * @for RabbitMQ
     */
    value: function getInstance( pid ) {
      return RabbitMQ.__instances ? RabbitMQ.__instances[ pid ] : null;
    },
    enumerable: false
  },
  _schemas: {
    /**
     * Schemas
     *
     * @attribute _schemas
     * @type object
     */
    value: {
      service: require( '../static/schemas/service' ),
      job: require( '../static/schemas/job' )
    },
    enumerable: false,
    writable: false
  },
  _instance: {
    /**
     * Instance Map
     *
     * @attribute _instance
     * @type object
     */
    value: {},
    enumerable: false,
    writable: true
  }
});