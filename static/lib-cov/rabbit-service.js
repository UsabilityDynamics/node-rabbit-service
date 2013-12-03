// instrument by jscoverage, do not modifly this file
(function () {
  var BASE;
  if (typeof global === 'object') {
    BASE = global;
  } else if (typeof window === 'object') {
    BASE = window;
  } else {
    throw new Error('[jscoverage] unknow ENV!');
  }
  if (!BASE._$jscoverage) {
    BASE._$jscoverage = {};
    BASE._$jscoverage_cond = {};
    BASE._$jscoverage_done = function (file, line, express) {
      if (arguments.length === 2) {
        BASE._$jscoverage[file][line] ++;
      } else {
        BASE._$jscoverage_cond[file][line] ++;
        return express;
      }
    };
    BASE._$jscoverage_init = function (base, file, lines) {
      var tmp = [];
      for (var i = 0; i < lines.length; i ++) {
        tmp[lines[i]] = 0;
      }
      base[file] = tmp;
    };
  }
})();
_$jscoverage_init(_$jscoverage, "lib/rabbit-service.js",[20,23,24,28,31,32,36,39,40,42,45,53,54,58,71,74,77,80,83,87,95,105,107,110,123,125,128,130,131,133,139,140,144,146,148,159,160,164,165,168,171,174,196,197,201,215,217,220,221,225,232,235,236,238,240,241,247,248,249,251,254,256,264,269,270,271,272,276,277,280,282,287,303,306,315,316,320,323,326,327,331,431,432,433,435,437,438,441,442,446,458,472,493,505,517]);
_$jscoverage_init(_$jscoverage_cond, "lib/rabbit-service.js",[23,31,53,130,144,144,159,164,196,220,251,280,315,326,437,441,441]);
_$jscoverage["lib/rabbit-service.js"].source = ["/**"," * RabbitService Service Constructor"," *"," * Events"," * - server.exit"," * - server.starting"," *"," * @class RabbitService"," * @constructor"," * @version 3.2.0"," * @async"," *"," * @param settings {Object} Configuration settings."," * @param callback {Function} Callback function."," *"," * @returns {RabbitService}"," * @constructor"," */","function RabbitService( handler ) {","  this.debug( 'Creating service with [%s].', 'function' === typeof handler ? handler.name : typeof handler );","","  // Make sure context is correct otherwise we could screw up the global scope.","  if( !( this instanceof RabbitService ) ) {","    return new RabbitService( handler );","  }","","  // Clone Context.","  var context = this;","","  // If an object is passed instead of a function.","  if( 'function' !== typeof handler ) {","    handler = RabbitClient.utility.noop;","  }","","  // Extend child's prototype with RabbitService, Object Emitter and Object Settings","  RabbitService.utility.inherits( handler, RabbitService );","","  // Mixing external prototypes.","  RabbitService.utility.settings( handler.prototype );","  RabbitService.utility.emitter( handler.prototype );","","  try {","","    // Instante Settings.","    handler.prototype.set({","      settings: RabbitService.utility.omit( RabbitService.utility.defaults( handler, require( '../package' ).config ), 'super_'  ),","      directories: require( '../package' ).directories,","      module_root: RabbitService.utility.dirname( RabbitService.utility.dirname( module.filename ) ),","      distribution: 'rabbitmq-3.2.0'","    });","","    // Detect ODX","    if( process.platform === 'darwin' ) {","      handler.prototype.set( 'distribution', 'rabbitmq-3.2.0-mac' );","    }","","    // Computed Settings.","    handler.prototype.set({","      id: process.pid,","      name: undefined,","      bin: {","        ctl: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), \"sbin/rabbitmqctl\" ),","        defaults: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), \"sbin/rabbitmq-defaults\" ),","        env: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), \"sbin/rabbitmq-env\" ),","        plugins: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), \"sbin/rabbitmq-plugins\" ),","        server: RabbitService.utility.realpath( handler.prototype.get( 'module_root' ), 'vendor', handler.prototype.get( 'distribution' ), \"sbin/rabbitmq-server\" )","      }","    });","","    // Instantaite the handler","    context = new handler( null, context );","","    // Validate Settings.","    context.validate();","","    // Spawn Process.","    context.spawn();","","    // Save instance.","    RabbitService._instance[ context.get( 'settings.name' ) ] = context;","","  } catch( error ) {","      return new handler( error, RabbitService ).error( error );","  }","","  // @chainable","  return context;","","}","","/**"," * Instance Properties"," *"," */","Object.defineProperties( RabbitService.prototype, {","  stop: {","    /**","     * Log Entry","     *","     * @method log","     * @uses winston","     * @for RabbitService.prototype","     */","    value: function log() {","      this.debug( 'Stopping Service [%s].', this.get( 'process.pid' ) );","","      process.kill( this.get( 'process.pid' ), 'SIGHUP' );","","      // @chainable","      return this;","","    },","    enumerable: true","  },","  validate: {","    /**","     * Validate Settings","     *","     * @method validate","     * @for RabbitService.prototype","     */","    value: function validate() {","      this.debug( 'Validating Service [%s].', this.get( 'settings.name' ) );","","      var self = this;","","      // Compute absolute paths to directories","      RabbitService.utility.each( this.get( 'directories' ), function( value, key ) {","","        if( require( 'path' ).resolve( require( 'path' ).join( self.get( 'module_root' ), '../.dynamic', key  ) ) ) {","          self.set( 'directories.' + key, require( 'path' ).resolve( require( 'path' ).join( self.get( 'module_root' ), value  ) ) )","        } else {","          self.set( 'directories.' + key, require( 'path' ).join( '~', value ) )","        }","","      });","","      // Compute absolute paths to directories","      RabbitService.utility.each( self.get( 'settings.bin' ), function( value, key ) {","        self.set( 'settings.bin.' + key, RabbitService.utility.realpath( value ) || RabbitService.utility.absolute_path( '../.dynamic/' + key, self.get( 'module_root' ) ) )","      });","","      // Convert URL to Keys","      if( this.get( 'settings.url' ) || process.env.RABBIT_URL ) {","","        var _parse = RabbitService.utility.url_parse( this.get( 'settings.url' ) || process.env.RABBIT_URL );","","        this.set( 'settings', RabbitService.utility.defaults( this.get( 'settings' ), {","          host: _parse.hostname,","          port: _parse.port,","          login: _parse.auth ? _parse.auth.split( ':' )[0] : '',","          password: _parse.auth ? _parse.auth.split( ':' )[1] : '',","          vhost: _parse.pathname || '/'","        }));","","      }","","      // Set Host","      if( !this.get( 'settings.host' ) ) {","        this.set( 'settings.host', process.env.RABBIT_HOST );","      }","","      // Set Port","      if( !this.get( 'settings.port' ) ) {","        this.set( 'settings.port', process.env.RABBIT_PORT );","      }","","      this.set( 'name', [ this.get( 'settings.name' ), this.get( 'settings.hostname', 'localhost' ) ].join( '@' ) );","","      // Validate Settings","      self.set( 'validation', RabbitService.utility.validate( self.get( 'settings' ), RabbitService._schemas.service ) );","","      // Prepare spawn environment.","      this.set( 'environment', {","        RABBITMQ_NODE_IP_ADDRESS: this.get( 'settings.host' ),","        RABBITMQ_NODE_PORT: this.get( 'settings.port' ),","        RABBITMQ_NODENAME: this.get( 'name' ),","        RABBITMQ_SERVICENAME: this.get( 'name' ),","        // RABBITMQ_CONSOLE_LOG: 'new',","        // RABBITMQ_CTL_ERL_ARGS: '',","        // RABBITMQ_SERVER_ERL_ARGS: '',","        // RABBITMQ_SERVER_START_ARGS: '',","        RABBITMQ_BASE: this.get( 'directories.dynamic' ) + '',","        // RABBITMQ_CONFIG_FILE: this.get( 'directories.config' ), // etc/rabbitmq/rabbitmq","        RABBITMQ_MNESIA_BASE: this.get( 'directories.cache' ),","        RABBITMQ_MNESIA_DIR: this.get( 'directories.cache' ),","        RABBITMQ_LOG_BASE: this.get( 'directories.log' ), // /var/log/rabbitmq","        //RABBITMQ_SASL_LOGS: this.get( 'directories.logs' ) + '',","        //RABBITMQ_PLUGINS_DIR: this.get( 'directories.logs' ) + '/server-log.log',","        //RABBITMQ_PLUGINS_EXPAND_DIR: this.get( 'directories.logs' ) + '/server-log.log',","        //RABBITMQ_ENABLED_PLUGINS_FILE: this.get( 'directories.logs' ) + '/server-log.log',","        RABBITMQ_PID_FILE: this.get( 'directories.pid' ) + '/rabbitmq'","      });","","      // Validate Settings","      if( !this.get( 'validation.is_valid' ) ) {","        throw new Error( 'Validation Failure: ' + this.get( 'validation.errors' ) );","      }","","      // @chainable","      return this;","","    },","    enumerable: true","  },","  spawn: {","    /**","     * Log Entry","     *","     * @method log","     * @uses winston","     * @for RabbitService.prototype","     */","    value: function spawn() {","      this.debug( 'Spawning Service [%s].', this.get( 'settings.name' ) );","","      var context = this;","","      // Already spawned.","      if( context.process ) {","        return context.process;","      }","","      // Spawn RabbitService Server Process.","      context.process = RabbitService.utility.spawn( context.get( 'bin.server' ), [ \"__detached\" ], {","        cwd: context.get( 'directories.dynamic' ),","        env: RabbitService.utility.defaults( context.get( 'environment' ), process.env ),","        detached: false","      });","","      // Update settings after process spawned.","      context.set( 'process', RabbitService.utility.pick( context.process, 'pid', 'connected' ) );","","      // If RabbitMQ Server is shut off externally, we may need to renable it.","      context.process.on( 'exit', function( code ) {","        context.debug( 'Server exit event [%s].', code );","","        context.emit( 'server.exit', arguments );","","        setTimeout( function() {","          context.debug( 'RabbitMQ Server killed. Quitting....' );","        }, 5000 )","","      });","","      // Try to parse JSON, Output Data","      context.process.stdout.on( 'data', function() {","        var data = RabbitService.utility.trim( arguments[0] );","        var match;","","        if( match = data.match( /(completed with ([<plugins>\\d]) plugins.)/i ) ) {","","          // Extracted plugin count.","          context.set( 'plugins', match[2] );","","          return context.emit( 'server.ready', null, {","            plugins: context.get( 'plugins' ),","            pid: context.get( 'process.pid' )","          });","","        }","","        // Unmatched string.","        context.emit( 'server.info', null, data );","","      });","","      // Try to parse JSON, Output Error","      context.process.stderr.on( 'data', function( data ) {","        data = RabbitService.utility.trim( data );","        context.debug( 'Server error: [%s].', data );","        context.emit( 'server.error', new Error( data ) );","      });","","      // Spawn error.","      context.process.on( 'error', function error( error ) {","        context.debug( 'Server spawn error: [%s].', error.message );","","        // Can not locate a file.","        if( error.code === 'ENOENT' ) {}","","        context.emit( 'server.error', error );","","      });","","      // @chainable","      return this;","","    },","    enumerable: true","  },","  log: {","    /**","     * Logger","     *","     * @method log","     * @chainable","     * @returns {*}","     */","    value: function log() {","","      // @todo Replace with winston","      console.log.apply( console, arguments );","","      // @chainable","      return this","","    },","    enumerable: false,","    writable: true","  },","  error: {","    value: function error( error ) {","","      if( 'string' === typeof error ) {","        error = new Error( error );","      }","","      // Debug error.","      this.debug( error );","","      // Log error.","      this.log( \"Rabbit Service Error: [%s][%s]\", error.message, error.code );","","      // Emit error.","      if( this.emit ) {","        this.emit( 'error', error );","      }","","      // @chainable","      return this;","","    },","    enumerable: false,","    writable: true","  },","  debug: {","    /**","     * Debug Entry","     *","     * @method debug","     * @for RabbitService.prototype","     */","    value: require( 'debug' )( 'rabbit:service' ),","    enumerable: true","  },","  createProducer: {","    /**","     * Create Client","     *","     * @method createClient","     * @for RabbitService.prototype","     */","    value: function createClient() {","","    },","    enumerable: true","  },","  createConsumer: {","    /**","     * Create Client","     *","     * @method createClient","     * @for RabbitService.prototype","     */","    value: function createClient() {","","    },","    enumerable: true","  },","  createClient: {","    /**","     * Create Client","     *","     * @method createClient","     * @for RabbitService.prototype","     */","    value: function createClient() {","","    },","    enumerable: true","  },","  registerActivity: {","    /**","     * Create Job","     *","     * @method registerActivity","     * @for RabbitService.prototype","     */","    value: function registerActivity() {","","    },","    enumerable: true","  },","  processTask: {","    /**","     * Create Job","     *","     * @method registerActivity","     * @for RabbitService.prototype","     */","    value: function registerActivity() {","","    },","    enumerable: true","  },","  manage: {","    /**","     * Create Job","     *","     * @method registerActivity","     * @for RabbitService.prototype","     */","    value: function registerActivity() {","","    },","    enumerable: true","  },","  configure: {","    /**","     * Configure Client","     *","     * Method executed when connection is ready.","     * Usage and semantics emulating Express.","     *","     * @param env","     * @param fn","     * @returns {*}","     */","    value: function configure( env, fn ) {","      var self = this;","      var envs = 'all';","      var args = [].slice.call( arguments );","","      fn = args.pop();","","      if( args.length ) {","        envs = args;","      }","","      if( 'all' == envs || ~envs.indexOf( this.get( 'settings.environment' ) ) ) {","        self.on( 'ready', fn.bind( this, this ) );","      }","","      // @chainable","      return this;","","    },","    enumerable: true,","    writable: false","  }","});","","/**"," * Constructor Properties"," *"," */","Object.defineProperties( module.exports = RabbitService, {","  version: {","    value: require( '../package.json' ).version,","    enumerable: false,","    writable: false","  },","  create: {","    /**","     * Create Instance","     *","     * @method create","     * @for RabbitService","     */","    value: function create( handler ) {","      return new RabbitService( handler );","    },","    enumerable: false","  },","  utility: {","    /**","     * Utility Methods","     *","     * @for RabbitService","     */","    value: require( './utility' ),","    enumerable: false","  },","  startService: {","    /**","     * Create Instance","     *","     * @method create","     * @for RabbitService","     */","    get: function startService() {","      return RabbitService.create;","    },","    enumerable: true","  },","  createClient: {","    /**","     * Create Generic Client","     *","     * @method createClient","     * @for RabbitService","     */","    get: function startService() {","      return require( 'rabbit-client' ).create;","    },","    enumerable: true","  },","  getInstance: {","    /**","     * Get Instance by PID","     *","     * @method create","     * @for RabbitService","     */","    value: function getInstance( pid ) {","      return RabbitService._instances ? RabbitService._instances[ pid ] : null;","    },","    enumerable: false","  },","  _schemas: {","    /**","     * Schemas","     *","     * @attribute _schemas","     * @type object","     */","    value: {","      service: require( '../static/schemas/service' ),","      job: require( '../static/schemas/job' )","    },","    enumerable: false,","    writable: false","  },","  _instance: {","    /**","     * Instance Map","     *","     * @attribute _instance","     * @type object","     */","    value: {},","    enumerable: false,","    writable: true","  }","});","",""];
function RabbitService(handler) {
    _$jscoverage_done("lib/rabbit-service.js", 20);
    this.debug("Creating service with [%s].", "function" === typeof handler ? handler.name : typeof handler);
    _$jscoverage_done("lib/rabbit-service.js", 23);
    if (_$jscoverage_done("lib/rabbit-service.js", 23, !(this instanceof RabbitService))) {
        _$jscoverage_done("lib/rabbit-service.js", 24);
        return new RabbitService(handler);
    }
    _$jscoverage_done("lib/rabbit-service.js", 28);
    var context = this;
    _$jscoverage_done("lib/rabbit-service.js", 31);
    if (_$jscoverage_done("lib/rabbit-service.js", 31, "function" !== typeof handler)) {
        _$jscoverage_done("lib/rabbit-service.js", 32);
        handler = RabbitClient.utility.noop;
    }
    _$jscoverage_done("lib/rabbit-service.js", 36);
    RabbitService.utility.inherits(handler, RabbitService);
    _$jscoverage_done("lib/rabbit-service.js", 39);
    RabbitService.utility.settings(handler.prototype);
    _$jscoverage_done("lib/rabbit-service.js", 40);
    RabbitService.utility.emitter(handler.prototype);
    _$jscoverage_done("lib/rabbit-service.js", 42);
    try {
        _$jscoverage_done("lib/rabbit-service.js", 45);
        handler.prototype.set({
            settings: RabbitService.utility.omit(RabbitService.utility.defaults(handler, require("../package").config), "super_"),
            directories: require("../package").directories,
            module_root: RabbitService.utility.dirname(RabbitService.utility.dirname(module.filename)),
            distribution: "rabbitmq-3.2.0"
        });
        _$jscoverage_done("lib/rabbit-service.js", 53);
        if (_$jscoverage_done("lib/rabbit-service.js", 53, process.platform === "darwin")) {
            _$jscoverage_done("lib/rabbit-service.js", 54);
            handler.prototype.set("distribution", "rabbitmq-3.2.0-mac");
        }
        _$jscoverage_done("lib/rabbit-service.js", 58);
        handler.prototype.set({
            id: process.pid,
            name: undefined,
            bin: {
                ctl: RabbitService.utility.realpath(handler.prototype.get("module_root"), "vendor", handler.prototype.get("distribution"), "sbin/rabbitmqctl"),
                defaults: RabbitService.utility.realpath(handler.prototype.get("module_root"), "vendor", handler.prototype.get("distribution"), "sbin/rabbitmq-defaults"),
                env: RabbitService.utility.realpath(handler.prototype.get("module_root"), "vendor", handler.prototype.get("distribution"), "sbin/rabbitmq-env"),
                plugins: RabbitService.utility.realpath(handler.prototype.get("module_root"), "vendor", handler.prototype.get("distribution"), "sbin/rabbitmq-plugins"),
                server: RabbitService.utility.realpath(handler.prototype.get("module_root"), "vendor", handler.prototype.get("distribution"), "sbin/rabbitmq-server")
            }
        });
        _$jscoverage_done("lib/rabbit-service.js", 71);
        context = new handler(null, context);
        _$jscoverage_done("lib/rabbit-service.js", 74);
        context.validate();
        _$jscoverage_done("lib/rabbit-service.js", 77);
        context.spawn();
        _$jscoverage_done("lib/rabbit-service.js", 80);
        RabbitService._instance[context.get("settings.name")] = context;
    } catch (error) {
        _$jscoverage_done("lib/rabbit-service.js", 83);
        return (new handler(error, RabbitService)).error(error);
    }
    _$jscoverage_done("lib/rabbit-service.js", 87);
    return context;
}

_$jscoverage_done("lib/rabbit-service.js", 95);
Object.defineProperties(RabbitService.prototype, {
    stop: {
        value: function log() {
            _$jscoverage_done("lib/rabbit-service.js", 105);
            this.debug("Stopping Service [%s].", this.get("process.pid"));
            _$jscoverage_done("lib/rabbit-service.js", 107);
            process.kill(this.get("process.pid"), "SIGHUP");
            _$jscoverage_done("lib/rabbit-service.js", 110);
            return this;
        },
        enumerable: true
    },
    validate: {
        value: function validate() {
            _$jscoverage_done("lib/rabbit-service.js", 123);
            this.debug("Validating Service [%s].", this.get("settings.name"));
            _$jscoverage_done("lib/rabbit-service.js", 125);
            var self = this;
            _$jscoverage_done("lib/rabbit-service.js", 128);
            RabbitService.utility.each(this.get("directories"), function(value, key) {
                _$jscoverage_done("lib/rabbit-service.js", 130);
                if (_$jscoverage_done("lib/rabbit-service.js", 130, require("path").resolve(require("path").join(self.get("module_root"), "../.dynamic", key)))) {
                    _$jscoverage_done("lib/rabbit-service.js", 131);
                    self.set("directories." + key, require("path").resolve(require("path").join(self.get("module_root"), value)));
                } else {
                    _$jscoverage_done("lib/rabbit-service.js", 133);
                    self.set("directories." + key, require("path").join("~", value));
                }
            });
            _$jscoverage_done("lib/rabbit-service.js", 139);
            RabbitService.utility.each(self.get("settings.bin"), function(value, key) {
                _$jscoverage_done("lib/rabbit-service.js", 140);
                self.set("settings.bin." + key, RabbitService.utility.realpath(value) || RabbitService.utility.absolute_path("../.dynamic/" + key, self.get("module_root")));
            });
            _$jscoverage_done("lib/rabbit-service.js", 144);
            if (_$jscoverage_done("lib/rabbit-service.js", 144, this.get("settings.url")) || _$jscoverage_done("lib/rabbit-service.js", 144, process.env.RABBIT_URL)) {
                _$jscoverage_done("lib/rabbit-service.js", 146);
                var _parse = RabbitService.utility.url_parse(this.get("settings.url") || process.env.RABBIT_URL);
                _$jscoverage_done("lib/rabbit-service.js", 148);
                this.set("settings", RabbitService.utility.defaults(this.get("settings"), {
                    host: _parse.hostname,
                    port: _parse.port,
                    login: _parse.auth ? _parse.auth.split(":")[0] : "",
                    password: _parse.auth ? _parse.auth.split(":")[1] : "",
                    vhost: _parse.pathname || "/"
                }));
            }
            _$jscoverage_done("lib/rabbit-service.js", 159);
            if (_$jscoverage_done("lib/rabbit-service.js", 159, !this.get("settings.host"))) {
                _$jscoverage_done("lib/rabbit-service.js", 160);
                this.set("settings.host", process.env.RABBIT_HOST);
            }
            _$jscoverage_done("lib/rabbit-service.js", 164);
            if (_$jscoverage_done("lib/rabbit-service.js", 164, !this.get("settings.port"))) {
                _$jscoverage_done("lib/rabbit-service.js", 165);
                this.set("settings.port", process.env.RABBIT_PORT);
            }
            _$jscoverage_done("lib/rabbit-service.js", 168);
            this.set("name", [ this.get("settings.name"), this.get("settings.hostname", "localhost") ].join("@"));
            _$jscoverage_done("lib/rabbit-service.js", 171);
            self.set("validation", RabbitService.utility.validate(self.get("settings"), RabbitService._schemas.service));
            _$jscoverage_done("lib/rabbit-service.js", 174);
            this.set("environment", {
                RABBITMQ_NODE_IP_ADDRESS: this.get("settings.host"),
                RABBITMQ_NODE_PORT: this.get("settings.port"),
                RABBITMQ_NODENAME: this.get("name"),
                RABBITMQ_SERVICENAME: this.get("name"),
                RABBITMQ_BASE: this.get("directories.dynamic") + "",
                RABBITMQ_MNESIA_BASE: this.get("directories.cache"),
                RABBITMQ_MNESIA_DIR: this.get("directories.cache"),
                RABBITMQ_LOG_BASE: this.get("directories.log"),
                RABBITMQ_PID_FILE: this.get("directories.pid") + "/rabbitmq"
            });
            _$jscoverage_done("lib/rabbit-service.js", 196);
            if (_$jscoverage_done("lib/rabbit-service.js", 196, !this.get("validation.is_valid"))) {
                _$jscoverage_done("lib/rabbit-service.js", 197);
                throw new Error("Validation Failure: " + this.get("validation.errors"));
            }
            _$jscoverage_done("lib/rabbit-service.js", 201);
            return this;
        },
        enumerable: true
    },
    spawn: {
        value: function spawn() {
            _$jscoverage_done("lib/rabbit-service.js", 215);
            this.debug("Spawning Service [%s].", this.get("settings.name"));
            _$jscoverage_done("lib/rabbit-service.js", 217);
            var context = this;
            _$jscoverage_done("lib/rabbit-service.js", 220);
            if (_$jscoverage_done("lib/rabbit-service.js", 220, context.process)) {
                _$jscoverage_done("lib/rabbit-service.js", 221);
                return context.process;
            }
            _$jscoverage_done("lib/rabbit-service.js", 225);
            context.process = RabbitService.utility.spawn(context.get("bin.server"), [ "__detached" ], {
                cwd: context.get("directories.dynamic"),
                env: RabbitService.utility.defaults(context.get("environment"), process.env),
                detached: false
            });
            _$jscoverage_done("lib/rabbit-service.js", 232);
            context.set("process", RabbitService.utility.pick(context.process, "pid", "connected"));
            _$jscoverage_done("lib/rabbit-service.js", 235);
            context.process.on("exit", function(code) {
                _$jscoverage_done("lib/rabbit-service.js", 236);
                context.debug("Server exit event [%s].", code);
                _$jscoverage_done("lib/rabbit-service.js", 238);
                context.emit("server.exit", arguments);
                _$jscoverage_done("lib/rabbit-service.js", 240);
                setTimeout(function() {
                    _$jscoverage_done("lib/rabbit-service.js", 241);
                    context.debug("RabbitMQ Server killed. Quitting....");
                }, 5e3);
            });
            _$jscoverage_done("lib/rabbit-service.js", 247);
            context.process.stdout.on("data", function() {
                _$jscoverage_done("lib/rabbit-service.js", 248);
                var data = RabbitService.utility.trim(arguments[0]);
                _$jscoverage_done("lib/rabbit-service.js", 249);
                var match;
                _$jscoverage_done("lib/rabbit-service.js", 251);
                if (_$jscoverage_done("lib/rabbit-service.js", 251, match = data.match(/(completed with ([<plugins>\d]) plugins.)/i))) {
                    _$jscoverage_done("lib/rabbit-service.js", 254);
                    context.set("plugins", match[2]);
                    _$jscoverage_done("lib/rabbit-service.js", 256);
                    return context.emit("server.ready", null, {
                        plugins: context.get("plugins"),
                        pid: context.get("process.pid")
                    });
                }
                _$jscoverage_done("lib/rabbit-service.js", 264);
                context.emit("server.info", null, data);
            });
            _$jscoverage_done("lib/rabbit-service.js", 269);
            context.process.stderr.on("data", function(data) {
                _$jscoverage_done("lib/rabbit-service.js", 270);
                data = RabbitService.utility.trim(data);
                _$jscoverage_done("lib/rabbit-service.js", 271);
                context.debug("Server error: [%s].", data);
                _$jscoverage_done("lib/rabbit-service.js", 272);
                context.emit("server.error", new Error(data));
            });
            _$jscoverage_done("lib/rabbit-service.js", 276);
            context.process.on("error", function error(error) {
                _$jscoverage_done("lib/rabbit-service.js", 277);
                context.debug("Server spawn error: [%s].", error.message);
                _$jscoverage_done("lib/rabbit-service.js", 280);
                if (_$jscoverage_done("lib/rabbit-service.js", 280, error.code === "ENOENT")) {}
                _$jscoverage_done("lib/rabbit-service.js", 282);
                context.emit("server.error", error);
            });
            _$jscoverage_done("lib/rabbit-service.js", 287);
            return this;
        },
        enumerable: true
    },
    log: {
        value: function log() {
            _$jscoverage_done("lib/rabbit-service.js", 303);
            console.log.apply(console, arguments);
            _$jscoverage_done("lib/rabbit-service.js", 306);
            return this;
        },
        enumerable: false,
        writable: true
    },
    error: {
        value: function error(error) {
            _$jscoverage_done("lib/rabbit-service.js", 315);
            if (_$jscoverage_done("lib/rabbit-service.js", 315, "string" === typeof error)) {
                _$jscoverage_done("lib/rabbit-service.js", 316);
                error = new Error(error);
            }
            _$jscoverage_done("lib/rabbit-service.js", 320);
            this.debug(error);
            _$jscoverage_done("lib/rabbit-service.js", 323);
            this.log("Rabbit Service Error: [%s][%s]", error.message, error.code);
            _$jscoverage_done("lib/rabbit-service.js", 326);
            if (_$jscoverage_done("lib/rabbit-service.js", 326, this.emit)) {
                _$jscoverage_done("lib/rabbit-service.js", 327);
                this.emit("error", error);
            }
            _$jscoverage_done("lib/rabbit-service.js", 331);
            return this;
        },
        enumerable: false,
        writable: true
    },
    debug: {
        value: require("debug")("rabbit:service"),
        enumerable: true
    },
    createProducer: {
        value: function createClient() {},
        enumerable: true
    },
    createConsumer: {
        value: function createClient() {},
        enumerable: true
    },
    createClient: {
        value: function createClient() {},
        enumerable: true
    },
    registerActivity: {
        value: function registerActivity() {},
        enumerable: true
    },
    processTask: {
        value: function registerActivity() {},
        enumerable: true
    },
    manage: {
        value: function registerActivity() {},
        enumerable: true
    },
    configure: {
        value: function configure(env, fn) {
            _$jscoverage_done("lib/rabbit-service.js", 431);
            var self = this;
            _$jscoverage_done("lib/rabbit-service.js", 432);
            var envs = "all";
            _$jscoverage_done("lib/rabbit-service.js", 433);
            var args = [].slice.call(arguments);
            _$jscoverage_done("lib/rabbit-service.js", 435);
            fn = args.pop();
            _$jscoverage_done("lib/rabbit-service.js", 437);
            if (_$jscoverage_done("lib/rabbit-service.js", 437, args.length)) {
                _$jscoverage_done("lib/rabbit-service.js", 438);
                envs = args;
            }
            _$jscoverage_done("lib/rabbit-service.js", 441);
            if (_$jscoverage_done("lib/rabbit-service.js", 441, "all" == envs) || _$jscoverage_done("lib/rabbit-service.js", 441, ~envs.indexOf(this.get("settings.environment")))) {
                _$jscoverage_done("lib/rabbit-service.js", 442);
                self.on("ready", fn.bind(this, this));
            }
            _$jscoverage_done("lib/rabbit-service.js", 446);
            return this;
        },
        enumerable: true,
        writable: false
    }
});

_$jscoverage_done("lib/rabbit-service.js", 458);
Object.defineProperties(module.exports = RabbitService, {
    version: {
        value: require("../package.json").version,
        enumerable: false,
        writable: false
    },
    create: {
        value: function create(handler) {
            _$jscoverage_done("lib/rabbit-service.js", 472);
            return new RabbitService(handler);
        },
        enumerable: false
    },
    utility: {
        value: require("./utility"),
        enumerable: false
    },
    startService: {
        get: function startService() {
            _$jscoverage_done("lib/rabbit-service.js", 493);
            return RabbitService.create;
        },
        enumerable: true
    },
    createClient: {
        get: function startService() {
            _$jscoverage_done("lib/rabbit-service.js", 505);
            return require("rabbit-client").create;
        },
        enumerable: true
    },
    getInstance: {
        value: function getInstance(pid) {
            _$jscoverage_done("lib/rabbit-service.js", 517);
            return RabbitService._instances ? RabbitService._instances[pid] : null;
        },
        enumerable: false
    },
    _schemas: {
        value: {
            service: require("../static/schemas/service"),
            job: require("../static/schemas/job")
        },
        enumerable: false,
        writable: false
    },
    _instance: {
        value: {},
        enumerable: false,
        writable: true
    }
});