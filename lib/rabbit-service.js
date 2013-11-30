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
  this.debug( 'Creating service with [%s].', 'function' === typeof handler ? handler.name : typeof handler );

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
      distribution: 'rabbitmq-3.2.0'
    });

    // Detect ODX
    if( process.platform === 'darwin' ) {
      handler.prototype.set( 'distribution', 'rabbitmq-3.2.0-mac' );
    }

    // Computed Settings.
    handler.prototype.set({
      id: process.pid,
      name: undefined,
      bin: {
        ctl: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), "sbin/rabbitmqctl" ),
        defaults: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), "sbin/rabbitmq-defaults" ),
        env: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), "sbin/rabbitmq-env" ),
        plugins: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), "sbin/rabbitmq-plugins" ),
        server: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), "sbin/rabbitmq-server" )
      }
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
      return new handler( error, RabbitService ).error( error );
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

      var self = this;

      // Compute absolute paths to directories
      RabbitService.utility.each( this.get( 'directories' ), function( value, key ) {

        // if path starts with a slash we let it be
        if( value.charAt(0) === '/' ) {
          return;
        }
        
        if( require( 'path' ).resolve( require( 'path' ).join( self.get( 'module_root' ), '../.dynamic', key  ) ) ) {
          self.set( 'directories.' + key, require( 'path' ).resolve( require( 'path' ).join( self.get( 'module_root' ), value  ) ) )
        } else {
          self.set( 'directories.' + key, require( 'path' ).join( '~', value ) )
        }

      });

      // Compute absolute paths to directories
      RabbitService.utility.each( self.get( 'settings.bin' ), function( value, key ) {
        self.set( 'settings.bin.' + key, RabbitService.utility.realpath( value ) || RabbitService.utility.absolute_path( '../.dynamic/' + key, self.get( 'module_root' ) ) )
      });

      // Convert URL to Keys
      if( this.get( 'settings.url' ) || process.env.RABBIT_URL ) {

        var _parse = RabbitService.utility.url_parse( this.get( 'settings.url' ) || process.env.RABBIT_URL );

        this.set( 'settings', RabbitService.utility.defaults( this.get( 'settings' ), {
          host: _parse.hostname,
          port: _parse.port,
          login: _parse.auth ? _parse.auth.split( ':' )[0] : '',
          password: _parse.auth ? _parse.auth.split( ':' )[1] : '',
          vhost: _parse.pathname || '/'
        }));

      }

      // Set Host
      if( !this.get( 'settings.host' ) ) {
        this.set( 'settings.host', process.env.RABBIT_HOST );
      }

      // Set Port
      if( !this.get( 'settings.port' ) ) {
        this.set( 'settings.port', process.env.RABBIT_PORT );
      }

      this.set( 'name', [ this.get( 'settings.name' ), this.get( 'settings.hostname', 'localhost' ) ].join( '@' ) );

      // Validate Settings
      self.set( 'validation', RabbitService.utility.validate( self.get( 'settings' ), RabbitService._schemas.service ) );

      // Prepare spawn environment.
      this.set( 'environment', {
        RABBITMQ_NODE_IP_ADDRESS: this.get( 'settings.host' ),
        RABBITMQ_NODE_PORT: this.get( 'settings.port' ),
        RABBITMQ_NODENAME: this.get( 'name' ),
        RABBITMQ_SERVICENAME: this.get( 'name' ),
        // RABBITMQ_CONSOLE_LOG: 'new',
        // RABBITMQ_CTL_ERL_ARGS: '',
        // RABBITMQ_SERVER_ERL_ARGS: '',
        // RABBITMQ_SERVER_START_ARGS: '',
        RABBITMQ_BASE: this.get( 'directories.dynamic' ) + '',
        RABBITMQ_CONFIG_FILE: this.get( 'directories.config' ) + '/rabbitmq',     // /etc/rabbit-service
        RABBITMQ_MNESIA_BASE: this.get( 'directories.cache' ),      // /var/cache/rabbit-service
        RABBITMQ_MNESIA_DIR: this.get( 'directories.cache' ),       // /var/cache/rabbit-service
        RABBITMQ_LOG_BASE: this.get( 'directories.log' ),           // /var/log/rabbit-service
        //RABBITMQ_SASL_LOGS: this.get( 'directories.logs' ) + '',
        //RABBITMQ_PLUGINS_DIR: this.get( 'directories.logs' ) + '  /server-log.log',
        //RABBITMQ_PLUGINS_EXPAND_DIR: this.get( 'directories.logs' ) + '/server-log.log',
        RABBITMQ_ENABLED_PLUGINS_FILE: this.get( 'directories.config' ) + '/enabled_plugins',
        RABBITMQ_PID_FILE: this.get( 'directories.pid' ) + '/rabbitmq'  // /var
      });

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
      context.process.stdout.on( 'data', function() {
        var data = RabbitService.utility.trim( arguments[0] );
        var match;

        if( match = data.match( /(completed with ([<plugins>\d]) plugins.)/i ) ) {

          // Extracted plugin count.
          context.set( 'plugins', match[2] );

          return context.emit( 'server.ready', null, {
            plugins: context.get( 'plugins' ),
            pid: context.get( 'process.pid' )
          });

        }

        // Unmatched string.
        context.emit( 'server.info', null, data );

      });

      // Try to parse JSON, Output Error
      context.process.stderr.on( 'data', function( data ) {
        data = RabbitService.utility.trim( data );
        context.debug( 'Server error: [%s].', data );
        context.emit( 'server.error', new Error( data ) );
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
     * Logger
     *
     * @method log
     * @chainable
     * @returns {*}
     */
    value: function log() {

      // @todo Replace with winston
      console.log.apply( console, arguments );

      // @chainable
      return this

    },
    enumerable: false,
    writable: true
  },
  error: {
    value: function error( error ) {

      if( 'string' === typeof error ) {
        error = new Error( error );
      }

      // Debug error.
      this.debug( error );

      // Log error.
      this.log( "Rabbit Service Error: [%s][%s]", error.message, error.code );

      // Emit error.
      if( this.emit ) {
        this.emit( 'error', error );
      }

      // @chainable
      return this;

    },
    enumerable: false,
    writable: true
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
  processTask: {
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

      if( 'all' == envs || ~envs.indexOf( this.get( 'settings.environment' ) ) ) {
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
  version: {
    value: require( '../package.json' ).version,
    enumerable: false,
    writable: false
  },
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

