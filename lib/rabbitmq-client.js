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

  var settings = 'object' === typeof arguments[0] ? arguments[0] : {};
  var callback = 'function' === typeof arguments[1] ? arguments[1] : RabbitMQ.utility.noop;

  // Extend settings with defaults
  RabbitMQ.utility.defaults( settings, require( '../package' ).config );

  // Extend child's prototype with RabbitMQ, Object Emitter and Object Settings
  RabbitMQ.utility.inherits( callback, RabbitMQ );
  RabbitMQ.utility.emitter.mixin( callback.prototype );
  RabbitMQ.utility.settings.mixin( callback.prototype  );

  // Instance Settings
  callback.prototype.set( 'validation', RabbitMQ.utility.validate.validate( settings, RabbitMQ._schemas.service ) );
  callback.prototype.set( 'settings', settings );
  callback.prototype.set( 'id', RabbitMQ.utility.hash( settings ) );
  callback.prototype.set( 'pid', undefined );

  try {

    // Validate Settings
    if( !callback.prototype.get( 'validation' ).is_valid ) {
      throw new Error( 'Validation Failure: ' + validation.errors.join() );
    }

    // Instantaite the extended Child Service
    callback = new callback( null, callback.prototype );


    // Successful service initialized - record instance.
    RabbitMQ._instance[ callback.get( 'id' ) ] = callback;

  } catch( error ) {
    console.error( error.message );
    return error;
  }

  // @chainable
  return callback;

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
     * @for RabbitMQ.prototype
     */
    value: function log() {
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