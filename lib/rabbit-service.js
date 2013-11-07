/**
 * RabbitService Service Constructor
 *
 * Events
 * - server.exit
 * - server.starting
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
function RabbitService( handler ) {
  this.debug( 'Creating service with [%s].', 'function' === typeof child ? child.name : typeof child );

  // Make sure context is correct otherwise we could screw up the global scope.
  if( !( this instanceof RabbitService ) ) {
    return new RabbitService( handler );
  }

  // Clone Context.
  var context = this;

  // If an object is passed instead of a function.
  if( 'function' !== typeof handler ) {
    handler = RabbitClient.utility.noop;
  }

  // Extend child's prototype with RabbitService, Object Emitter and Object Settings
  RabbitService.utility.inherits( handler, RabbitService );

  // Mixing external prototypes.
  RabbitService.utility.settings( handler.prototype );
  RabbitService.utility.emitter( handler.prototype );

  try {

    // Instante Settings.
    handler.prototype.set({
      settings: RabbitService.utility.omit( RabbitService.utility.defaults( handler, require( '../package' ).config ), 'super_'  ),
      directories: require( '../package' ).directories,
      module_root: RabbitService.utility.dirname( RabbitService.utility.dirname( module.filename ) ),
      distribution: 'rabbitmq-3.2.0',
      environment: process.env.NODE_ENV
    });

    // Detect ODX
    if( process.platform === 'darwin' ) {
      handler.prototype.set( 'distribution', 'rabbitmq-3.2.0-mac' );
    }

    // Computed Settings.
    handler.prototype.set({
      id: process.pid,
      name: [ handler.prototype.get( 'settings.name' ), handler.prototype.get( 'settings.hostname', 'localhost' ) ].join( '@' ),
      bin: {
        ctl: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), "sbin/rabbitmqctl" ),
        defaults: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), "sbin/rabbitmq-defaults" ),
        env: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), "sbin/rabbitmq-env" ),
        plugins: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), "sbin/rabbitmq-plugins" ),
        server: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), "sbin/rabbitmq-server" )
      }
    });

    // Compute absolute paths to directories
    RabbitService.utility.each( handler.prototype.get( 'directories' ), function( value, key ) {

      if( require( 'path' ).resolve( require( 'path' ).join( handler.prototype.get( 'module_root' ), '../.dynamic', key  ) ) ) {
        handler.prototype.set( 'directories.' + key, require( 'path' ).resolve( require( 'path' ).join( handler.prototype.get( 'module_root' ), value  ) ) )
      } else {
        handler.prototype.set( 'directories.' + key, require( 'path' ).join( '~', value ) )
      }

    });

    // Compute absolute paths to directories
    RabbitService.utility.each( handler.prototype.get( 'settings.bin' ), function( value, key ) {
      handler.prototype.set( 'settings.bin.' + key, RabbitService.utility.realpath( value ) || RabbitService.utility.absolute_path( '../.dynamic/' + key, handler.prototype.get( 'module_root' ) ) )
    });

    // Validate Settings
    handler.prototype.set( 'validation', RabbitService.utility.validate( handler.prototype.get( 'settings' ), RabbitService._schemas.service ) );

    // Prepare spawn environment.
    handler.prototype.set( 'environment', {
      RABBITMQ_NODE_IP_ADDRESS: handler.prototype.get( 'settings.host' ),
      RABBITMQ_NODE_PORT: handler.prototype.get( 'settings.port' ),
      RABBITMQ_NODENAME: handler.prototype.get( 'name' ),
      RABBITMQ_SERVICENAME: handler.prototype.get( 'name' ),
      // RABBITMQ_CONSOLE_LOG: 'new',
      // RABBITMQ_CTL_ERL_ARGS: '',
      // RABBITMQ_SERVER_ERL_ARGS: '',
      // RABBITMQ_SERVER_START_ARGS: '',
      RABBITMQ_BASE: handler.prototype.get( 'directories.dynamic' ) + '',
      // RABBITMQ_CONFIG_FILE: handler.prototype.get( 'directories.config' ), // etc/rabbitmq/rabbitmq
      RABBITMQ_MNESIA_BASE: handler.prototype.get( 'directories.cache' ),
      RABBITMQ_MNESIA_DIR: handler.prototype.get( 'directories.cache' ),
      RABBITMQ_LOG_BASE: handler.prototype.get( 'directories.log' ), // /var/log/rabbitmq
      //RABBITMQ_SASL_LOGS: handler.prototype.get( 'directories.logs' ) + '',
      //RABBITMQ_PLUGINS_DIR: handler.prototype.get( 'directories.logs' ) + '/server-log.log',
      //RABBITMQ_PLUGINS_EXPAND_DIR: handler.prototype.get( 'directories.logs' ) + '/server-log.log',
      //RABBITMQ_ENABLED_PLUGINS_FILE: handler.prototype.get( 'directories.logs' ) + '/server-log.log',
      RABBITMQ_PID_FILE: handler.prototype.get( 'directories.pid' ) + '/rabbitmq'
    });

    // Instantaite the handler
    context = new handler( null, context );

    // Validate Settings.
    context.validate();

    // Spawn Process.
    context.spawn();

    // Save instance.
    RabbitService._instance[ context.get( 'settings.name' ) ] = context;

  } catch( error ) {
    console.error( error );
    return context;
  }

  // @chainable
  return context;

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

      // @chainable
      return this;

    },
    enumerable: true
  },
  validate: {
    /**
     * Validate Settings
     *
     * @method validate
     * @for RabbitService.prototype
     */
    value: function validate() {
      this.debug( 'Validating Service [%s].', this.get( 'settings.name' ) );


      // Validate Settings
      if( !this.get( 'validation.is_valid' ) ) {
        throw new Error( 'Validation Failure: ' + this.get( 'validation.errors' ) );
      }

      // @chainable
      return this;

    },
    enumerable: true
  },
  spawn: {
    /**
     * Log Entry
     *
     * @method log
     * @uses winston
     * @for RabbitService.prototype
     */
    value: function spawn() {
      this.debug( 'Spawning Service [%s].', this.get( 'settings.name' ) );

      var context = this;

      // Already spawned.
      if( context.process ) {
        return context.process;
      }

      // Spawn RabbitService Server Process.
      context.process = RabbitService.utility.spawn( context.get( 'bin.server' ), [ "__detached" ], {
        cwd: context.get( 'directories.dynamic' ),
        env: RabbitService.utility.defaults( context.get( 'environment' ), process.env ),
        detached: false
      });

      // Update settings after process spawned.
      context.set( 'process', RabbitService.utility.pick( context.process, 'pid', 'connected' ) );

      // If RabbitMQ Server is shut off externally, we may need to renable it.
      context.process.on( 'exit', function( code ) {
        context.debug( 'Server exit event [%s].', code );

        context.emit( 'server.exit', arguments );

        setTimeout( function() {
          context.debug( 'RabbitMQ Server killed. Quitting....' );
        }, 5000 )

      });

      // Try to parse JSON, Output Data
      context.process.stdout.on( 'data', function( data ) {
        context.debug( 'Server data: [%s].', data.toString() );

        // @todo Console parser.
        // if( data.toString() == 'completed with [x] plugins.' ) {}

        context.emit( 'server.info', null, data.toString() );

        // @todo Fix to trigger once actually started.
        context.emit( 'server.ready', null, {
          pid: context.get( 'process.pid' )
        });

      });

      // Try to parse JSON, Output Error
      context.process.stderr.on( 'data', function( data ) {
        context.debug( 'Server error: [%s].', data.toString() );
        context.emit( 'server.error', new Error( data.toString() ) );
      });

      // Spawn error.
      context.process.on( 'error', function error( error ) {
        context.debug( 'Server spawn error: [%s].', error.message );

        // Can not locate a file.
        if( error.code === 'ENOENT' ) {}

        context.emit( 'server.error', error );

      });

      // @chainable
      return this;

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
    value: require( 'debug' )( 'rabbit:service' ),
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
  registerActivity: {
    /**
     * Create Job
     *
     * @method registerActivity
     * @for RabbitService.prototype
     */
    value: function registerActivity() {

    },
    enumerable: true
  },
  startActivity: {
    /**
     * Create Job
     *
     * @method registerActivity
     * @for RabbitService.prototype
     */
    value: function registerActivity() {

    },
    enumerable: true
  },
  manage: {
    /**
     * Create Job
     *
     * @method registerActivity
     * @for RabbitService.prototype
     */
    value: function registerActivity() {

    },
    enumerable: true
  },
  configure: {
    /**
     * Configure Client
     *
     * Method executed when connection is ready.
     * Usage and semantics emulating Express.
     *
     * @param env
     * @param fn
     * @returns {*}
     */
    value: function configure( env, fn ) {
      var self = this;
      var envs = 'all';
      var args = [].slice.call( arguments );

      fn = args.pop();

      if( args.length ) {
        envs = args;
      }

      if( 'all' == envs || ~envs.indexOf( this.get( 'environment' ) ) ) {
        self.on( 'ready', fn.bind( this, this ) );
      }

      // @chainable
      return this;

    },
    enumerable: true,
    writable: false
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
    value: function create( handler ) {
      return new RabbitService( handler );
    },
    enumerable: false
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
    get: function startService() {
      return require( 'rabbit-client' ).create;
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
      return RabbitService._instances ? RabbitService._instances[ pid ] : null;
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

