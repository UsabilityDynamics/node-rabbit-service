/**
 * RabbitService Service Constructor
 *
 * Events
 * - service.exit
 * - service.starting
 *
 * @class RabbitService
 * @constructor
 * @version 3.2.0
 * @async
 *
 * @param settings {Object} Configuration settings.
 * @param callback {Function} Callback function.
 *
 * @returns {RabbitService}
 * @constructor
 */
function RabbitService() {
  this.debug( 'Creating service with [%s].', 'function' === typeof child ? child.name : typeof child );

  // Make sure context is correct otherwise we could screw up the global scope.
  if( !( this instanceof RabbitService ) ) {
    return new RabbitService( arguments[0], arguments[1] );
  }

  var path      = require( 'path' );
  var settings  = 'object' === typeof arguments[0] ? arguments[0] : {};
  var callback  = 'function' === typeof arguments[1] ? arguments[1] : RabbitService.utility.noop;
  var self      = this;

  // Extend child's prototype with RabbitService, Object Emitter and Object Settings
  RabbitService.utility.inherits( callback, RabbitService );

  try {

    // Until the callback is instantiated we refere to its prototype
    self = callback.prototype;

    // Mixins.
    RabbitService.utility.emitter.mixin( self);
    RabbitService.utility.settings.mixin( self );

    // Instante Settings.
    self.set({
      settings: RabbitService.utility.defaults( settings, require( '../package' ).config ),
      module_root: RabbitService.utility.dirname( RabbitService.utility.dirname( module.filename ) ),
      distribution: 'rabbitmq-3.2.0'
    });

    // Detect ODX
    if( process.platform === 'darwin' ) {
      self.set( 'distribution', 'rabbitmq-3.2.0-mac' );
    }

    // Computed Settings.
    self.set({
      id: RabbitService.utility.hash( settings ),
      name: [ self.get( 'settings.name' ), self.get( 'settings.hostname', 'localhost' ) ].join( '@' ),
      bin: {
        ctl: RabbitService.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), "sbin/rabbitmqctl" ),
        defaults: RabbitService.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), "sbin/rabbitmq-defaults" ),
        env: RabbitService.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), "sbin/rabbitmq-env" ),
        plugins: RabbitService.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), "sbin/rabbitmq-plugins" ),
        server: RabbitService.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), "sbin/rabbitmq-server" )
      }
    });

    // Compute absolute paths to directories
    RabbitService.utility.each( self.get( 'settings.directories' ), function( value, key ) {

      if( require( 'path' ).resolve( require( 'path' ).join( self.get( 'module_root' ), '../.dynamic', key  ) ) ) {
        self.set( 'settings.directories.' + key, require( 'path' ).resolve( require( 'path' ).join( self.get( 'module_root' ), value  ) ) )
      } else {
        self.set( 'settings.directories.' + key, require( 'path' ).join( '~', value ) )
      }

    });

    // Compute absolute paths to directories
    RabbitService.utility.each( self.get( 'settings.bin' ), function( value, key ) {
      self.set( 'settings.bin.' + key, RabbitService.utility.realpath( value ) || RabbitService.utility.absolute_path( '../.dynamic/' + key, self.get( 'module_root' ) ) )
    });

    // Validate Settings
    self.set( 'validation', RabbitService.utility.validate( self.get( 'settings' ), RabbitService._schemas.service ) );

    self.set( 'environment', {
      RABBITMQ_NODE_IP_ADDRESS: self.get( 'settings.host' ),
      RABBITMQ_NODE_PORT: self.get( 'settings.port' ),
      RABBITMQ_NODENAME: self.get( 'name' ),
      RABBITMQ_SERVICENAME: self.get( 'name' ),
      RABBITMQ_CONSOLE_LOG: 'new', // Windows Only
      RABBITMQ_CTL_ERL_ARGS: '',
      RABBITMQ_SERVER_ERL_ARGS: '',
      RABBITMQ_SERVER_START_ARGS: '',
      RABBITMQ_CONFIG_FILE: self.get( 'settings.directories.config' ) + '/rabbitmq',
      RABBITMQ_PID_FILE: self.get( 'settings.directories.pid' ) + '/rabbitmq',
      RABBITMQ_MNESIA_DIR: self.get( 'settings.directories.cache' ),
      RABBITMQ_LOG_BASE: self.get( 'settings.directories.logs' )
    });

    // Validate Settings
    if( !self.get( 'validation' ).is_valid ) {
      throw new Error( 'Validation Failure: ' + validation.errors.join() );
    }

    // Instantaite the callback
    self = new callback( null, self );

    // Spawn RabbitService Server Process.
    self.process = RabbitService.utility.spawn( self.get( 'bin.server' ), [ "_detached" ], {
      cwd: self.get( 'directories.cache' ),
      env: RabbitService.utility.defaults( self.get( 'environment' ), process.env ),
      detached: false
    });

    // Update settings after process spawned.
    self.set( 'process', RabbitService.utility.pick( self.process, 'pid', 'connected' ) );

    self.process.on( 'exit', function() {
      self.emit( 'service.exit', arguments );
    });

    // Try to parse JSON, Output Data
    self.process.stdout.on( 'data', function( data ) {
      self.log( 'DATA:', data.toString() );
    });

    // Try to parse JSON, Output Error
    self.process.stderr.on( 'data', function( data ) {
      self.log( 'ERROR:', data.toString() );
    });

    process.nextTick( function() {
      self.emit( 'service.starting' );
    });

    // Save instance.
    RabbitService._instance[ self.get( 'settings.name' ) ] = self;

  } catch( error ) {
    console.error( error.message );
    return self;
  }

  // @chainable
  return self;

}

/**
 * Instance Properties
 *
 */
Object.defineProperties( RabbitService.prototype, {
  stop: {
    /**
     * Log Entry
     *
     * @method log
     * @uses winston
     * @for RabbitService.prototype
     */
    value: function log() {
      this.debug( 'Stopping Service [%s].', this.get( 'process.pid' ) );
      process.kill( this.get( 'process.pid' ), 'SIGHUP' );
    },
    enumerable: true
  },
  log: {
    /**
     * Log Entry
     *
     * @method log
     * @uses winston
     * @for RabbitService.prototype
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
     * @for RabbitService.prototype
     */
    value: require( 'debug' )( 'rabbitmq:lient' ),
    enumerable: true
  },
  createProducer: {
    /**
     * Create Client
     *
     * @method createClient
     * @for RabbitService.prototype
     */
    value: function createClient() {

    },
    enumerable: true
  },
  createConsumer: {
    /**
     * Create Client
     *
     * @method createClient
     * @for RabbitService.prototype
     */
    value: function createClient() {

    },
    enumerable: true
  },
  createClient: {
    /**
     * Create Client
     *
     * @method createClient
     * @for RabbitService.prototype
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
     * @for RabbitService.prototype
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
     * @for RabbitService.prototype
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
     * @for RabbitService.prototype
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
     * @for RabbitService.prototype
     */
    value: function configure( callback ) {
      this.on( 'ready', callback );
    },
    enumerable: true
  }
});

/**
 * Constructor Properties
 *
 */
Object.defineProperties( module.exports = RabbitService, {
  create: {
    /**
     * Create Instance
     *
     * @method create
     * @for RabbitService
     */
    value: function create( settings, callback ) {
      return new RabbitService( settings, callback );
    },
    enumerable: false
  },
  debug: {
    /**
     * Constructor Debugger
     *
     * @method debug
     * @for RabbitService
     */
    value: require( 'debug' )( 'rabbitmq:constructor' ),
    enumerable: true
  },
  destroy: {
    /**
     * Destroy Instance
     *
     * @method create
     * @for RabbitService
     */
    value: function destroy( pid ) {
      RabbitService.debug( 'destroy [%s]', pid );
    },
    enumerable: true
  },
  utility: {
    /**
     * Utility Methods
     *
     * @for RabbitService
     */
    value: require( './utility' ),
    enumerable: false
  },
  startService: {
    /**
     * Create Instance
     *
     * @method create
     * @for RabbitService
     */
    get: function startService() {
      return RabbitService.create;
    },
    enumerable: true
  },
  createClient: {
    /**
     * Create Generic Client
     *
     * @method createClient
     * @for RabbitService
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
     * @for RabbitService
     */
    value: function getInstance( pid ) {
      return RabbitService.__instances ? RabbitService.__instances[ pid ] : null;
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

