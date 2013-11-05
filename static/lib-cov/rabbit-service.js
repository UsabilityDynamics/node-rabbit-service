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
_$jscoverage_init(_$jscoverage, "lib/rabbit-service.js",[20,23,24,27,28,29,30,33,35,38,41,42,45,52,65,66,70,71,75,78,79,83,86,101,103,104,108,109,113,114,117,118,122,125,126,130,138,148,149,162,163,257,267,276,298,319,331,343]);
_$jscoverage_init(_$jscoverage_cond, "lib/rabbit-service.js",[23,78]);
_$jscoverage["lib/rabbit-service.js"].source = ["/**"," * RabbitMQ Service Constructor"," *"," * Events"," * - service.exit"," * - service.starting"," *"," * @class RabbitMQ"," * @constructor"," * @version 3.2.0"," * @async"," *"," * @param settings {Object} Configuration settings."," * @param callback {Function} Callback function."," *"," * @returns {RabbitMQ}"," * @constructor"," */","function RabbitMQ() {","  this.debug( 'Creating service with [%s].', 'function' === typeof child ? child.name : typeof child );","","  // Make sure context is correct otherwise we could screw up the global scope.","  if( !( this instanceof RabbitMQ ) ) {","    return new RabbitMQ( arguments[0], arguments[1] );","  }","","  var path      = require( 'path' );","  var settings  = 'object' === typeof arguments[0] ? arguments[0] : {};","  var callback  = 'function' === typeof arguments[1] ? arguments[1] : RabbitMQ.utility.noop;","  var self      = this;","","  // Extend child's prototype with RabbitMQ, Object Emitter and Object Settings","  RabbitMQ.utility.inherits( callback, RabbitMQ );","","  try {","","    // Until the callback is instantiated we refere to its prototype","    self = callback.prototype;","","    // Mixins.","    RabbitMQ.utility.emitter.mixin( self);","    RabbitMQ.utility.settings.mixin( self );","","    // Instante Settings.","    self.set({","      settings: RabbitMQ.utility.defaults( settings, require( '../package' ).config ),","      module_root: RabbitMQ.utility.dirname( RabbitMQ.utility.dirname( module.filename ) ),","      distribution: 'rabbitmq-3.2.0-mac'","    });","","    // Computed Settings.","    self.set({","      id: RabbitMQ.utility.hash( settings ),","      name: [ self.get( 'settings.name' ), self.get( 'settings.hostname', 'localhost' ) ].join( '@' ),","      bin: {","        ctl: RabbitMQ.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), \"sbin/rabbitmqctl\" ),","        defaults: RabbitMQ.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), \"sbin/rabbitmq-defaults\" ),","        env: RabbitMQ.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), \"sbin/rabbitmq-env\" ),","        plugins: RabbitMQ.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), \"sbin/rabbitmq-plugins\" ),","        server: RabbitMQ.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), \"sbin/rabbitmq-server\" )","      }","    });","","    // Compute absolute paths to directories","    RabbitMQ.utility.each( self.get( 'settings.directories' ), function( value, key ) {","      self.set( 'settings.directories.' + key, RabbitMQ.utility.realpath( value ) || RabbitMQ.utility.absolute_path( '../.dynamic/' + key, self.get( 'module_root' ) ) )","    });","","    // Compute absolute paths to directories","    RabbitMQ.utility.each( self.get( 'settings.bin' ), function( value, key ) {","      self.set( 'settings.bin.' + key, RabbitMQ.utility.realpath( value ) || RabbitMQ.utility.absolute_path( '../.dynamic/' + key, self.get( 'module_root' ) ) )","    });","","    // Validate Settings","    self.set( 'validation', RabbitMQ.utility.validate( self.get( 'settings' ), RabbitMQ._schemas.service ) );","","    // Validate Settings","    if( !self.get( 'validation' ).is_valid ) {","      throw new Error( 'Validation Failure: ' + validation.errors.join() );","    }","","    // Instantaite the callback","    self = new callback( null, self );","","    // Spawn RabbitMQ Server Process.","    self.process = RabbitMQ.utility.spawn( self.get( 'bin.server' ), [ \"_detached\" ], {","      cwd: process.cwd(),","      env: RabbitMQ.utility.extend( {}, process.env, {","        RABBITMQ_CONFIG_FILE: self.get( 'settings.directories.config' ) + '/rabbitmq',","        RABBITMQ_PID_FILE: self.get( 'settings.directories.pid' ) + '/rabbitmq',","        RABBITMQ_MNESIA_DIR: self.get( 'settings.directories.cache' ),","        RABBITMQ_NODE_PORT: self.get( 'settings.port' ),","        RABBITMQ_NODE_IP_ADDRESS: self.get( 'settings.host' ),","        RABBITMQ_NODENAME: self.get( 'name' ),","        RABBITMQ_LOG_BASE: self.get( 'settings.directories.logs' )","      }),","      detached: false","    });","","    // Update settings after process spawned.","    self.set( 'process', RabbitMQ.utility.pick( self.process, 'pid', 'connected' ) );","","    self.process.on( 'exit', function() {","      self.emit( 'service.exit', arguments );","    });","","    // Try to parse JSON, Output Data","    self.process.stdout.on( 'data', function( data ) {","      self.log( 'DATA:', data.toString() );","    });","","    // Try to parse JSON, Output Error","    self.process.stderr.on( 'data', function( data ) {","      self.log( 'ERROR:', data.toString() );","    });","","    process.nextTick( function() {","      self.emit( 'service.starting' );","    });","","    // Save instance.","    RabbitMQ._instance[ self.get( 'settings.name' ) ] = self;","","  } catch( error ) {","    console.error( error.message );","    return self;","  }","","  // @chainable","  return self;","","}","","/**"," * Instance Properties"," *"," */","Object.defineProperties( RabbitMQ.prototype, {","  stop: {","    /**","     * Log Entry","     *","     * @method log","     * @uses winston","     * @for RabbitMQ.prototype","     */","    value: function log() {","      this.debug( 'Stopping Service [%s].', this.get( 'process.pid' ) );","      process.kill( this.get( 'process.pid' ), 'SIGHUP' );","    },","    enumerable: true","  },","  log: {","    /**","     * Log Entry","     *","     * @method log","     * @uses winston","     * @for RabbitMQ.prototype","     */","    value: function log() {","      return console.log.apply( console, arguments );","      return require( 'winston' ).log.apply( null, arguments )","    },","    enumerable: true","  },","  debug: {","    /**","     * Debug Entry","     *","     * @method debug","     * @for RabbitMQ.prototype","     */","    value: require( 'debug' )( 'rabbitmq:lient' ),","    enumerable: true","  },","  createProducer: {","    /**","     * Create Client","     *","     * @method createClient","     * @for RabbitMQ.prototype","     */","    value: function createClient() {","","    },","    enumerable: true","  },","  createConsumer: {","    /**","     * Create Client","     *","     * @method createClient","     * @for RabbitMQ.prototype","     */","    value: function createClient() {","","    },","    enumerable: true","  },","  createClient: {","    /**","     * Create Client","     *","     * @method createClient","     * @for RabbitMQ.prototype","     */","    value: function createClient() {","","    },","    enumerable: true","  },","  registerJob: {","    /**","     * Create Job","     *","     * @method registerJob","     * @for RabbitMQ.prototype","     */","    value: function registerJob() {","","    },","    enumerable: true","  },","  runJob: {","    /**","     * Create Job","     *","     * @method registerJob","     * @for RabbitMQ.prototype","     */","    value: function registerJob() {","","    },","    enumerable: true","  },","  manage: {","    /**","     * Create Job","     *","     * @method registerJob","     * @for RabbitMQ.prototype","     */","    value: function registerJob() {","","    },","    enumerable: true","  },","  configure: {","    /**","     * Create Configuration Callback","     *","     * @method configure","     * @for RabbitMQ.prototype","     */","    value: function configure( callback ) {","      this.on( 'ready', callback );","    },","    enumerable: true","  }","});","","/**"," * Constructor Properties"," *"," */","Object.defineProperties( module.exports = RabbitMQ, {","  create: {","    /**","     * Create Instance","     *","     * @method create","     * @for RabbitMQ","     */","    value: function create( settings, callback ) {","      return new RabbitMQ( settings, callback );","    },","    enumerable: false","  },","  debug: {","    /**","     * Constructor Debugger","     *","     * @method debug","     * @for RabbitMQ","     */","    value: require( 'debug' )( 'rabbitmq:constructor' ),","    enumerable: true","  },","  destroy: {","    /**","     * Destroy Instance","     *","     * @method create","     * @for RabbitMQ","     */","    value: function destroy( pid ) {","      RabbitMQ.debug( 'destroy [%s]', pid );","    },","    enumerable: true","  },","  utility: {","    /**","     * Utility Methods","     *","     * @for RabbitMQ","     */","    value: require( './utility' ),","    enumerable: false","  },","  startService: {","    /**","     * Create Instance","     *","     * @method create","     * @for RabbitMQ","     */","    get: function startService() {","      return RabbitMQ.create;","    },","    enumerable: true","  },","  createClient: {","    /**","     * Create Generic Client","     *","     * @method createClient","     * @for RabbitMQ","     */","    value: function createClient( settings, callback ) {","      console.log( 'asdf' );","    },","    enumerable: true","  },","  getInstance: {","    /**","     * Get Instance by PID","     *","     * @method create","     * @for RabbitMQ","     */","    value: function getInstance( pid ) {","      return RabbitMQ.__instances ? RabbitMQ.__instances[ pid ] : null;","    },","    enumerable: false","  },","  _schemas: {","    /**","     * Schemas","     *","     * @attribute _schemas","     * @type object","     */","    value: {","      service: require( '../static/schemas/service' ),","      job: require( '../static/schemas/job' )","    },","    enumerable: false,","    writable: false","  },","  _instance: {","    /**","     * Instance Map","     *","     * @attribute _instance","     * @type object","     */","    value: {},","    enumerable: false,","    writable: true","  }","});","",""];
function RabbitMQ() {
    _$jscoverage_done("lib/rabbit-service.js", 20);
    this.debug("Creating service with [%s].", "function" === typeof child ? child.name : typeof child);
    _$jscoverage_done("lib/rabbit-service.js", 23);
    if (_$jscoverage_done("lib/rabbit-service.js", 23, !(this instanceof RabbitMQ))) {
        _$jscoverage_done("lib/rabbit-service.js", 24);
        return new RabbitMQ(arguments[0], arguments[1]);
    }
    _$jscoverage_done("lib/rabbit-service.js", 27);
    var path = require("path");
    _$jscoverage_done("lib/rabbit-service.js", 28);
    var settings = "object" === typeof arguments[0] ? arguments[0] : {};
    _$jscoverage_done("lib/rabbit-service.js", 29);
    var callback = "function" === typeof arguments[1] ? arguments[1] : RabbitMQ.utility.noop;
    _$jscoverage_done("lib/rabbit-service.js", 30);
    var self = this;
    _$jscoverage_done("lib/rabbit-service.js", 33);
    RabbitMQ.utility.inherits(callback, RabbitMQ);
    _$jscoverage_done("lib/rabbit-service.js", 35);
    try {
        _$jscoverage_done("lib/rabbit-service.js", 38);
        self = callback.prototype;
        _$jscoverage_done("lib/rabbit-service.js", 41);
        RabbitMQ.utility.emitter.mixin(self);
        _$jscoverage_done("lib/rabbit-service.js", 42);
        RabbitMQ.utility.settings.mixin(self);
        _$jscoverage_done("lib/rabbit-service.js", 45);
        self.set({
            settings: RabbitMQ.utility.defaults(settings, require("../package").config),
            module_root: RabbitMQ.utility.dirname(RabbitMQ.utility.dirname(module.filename)),
            distribution: "rabbitmq-3.2.0-mac"
        });
        _$jscoverage_done("lib/rabbit-service.js", 52);
        self.set({
            id: RabbitMQ.utility.hash(settings),
            name: [ self.get("settings.name"), self.get("settings.hostname", "localhost") ].join("@"),
            bin: {
                ctl: RabbitMQ.utility.realpath(self.get("module_root"), "vendor", self.get("distribution"), "sbin/rabbitmqctl"),
                defaults: RabbitMQ.utility.realpath(self.get("module_root"), "vendor", self.get("distribution"), "sbin/rabbitmq-defaults"),
                env: RabbitMQ.utility.realpath(self.get("module_root"), "vendor", self.get("distribution"), "sbin/rabbitmq-env"),
                plugins: RabbitMQ.utility.realpath(self.get("module_root"), "vendor", self.get("distribution"), "sbin/rabbitmq-plugins"),
                server: RabbitMQ.utility.realpath(self.get("module_root"), "vendor", self.get("distribution"), "sbin/rabbitmq-server")
            }
        });
        _$jscoverage_done("lib/rabbit-service.js", 65);
        RabbitMQ.utility.each(self.get("settings.directories"), function(value, key) {
            _$jscoverage_done("lib/rabbit-service.js", 66);
            self.set("settings.directories." + key, RabbitMQ.utility.realpath(value) || RabbitMQ.utility.absolute_path("../.dynamic/" + key, self.get("module_root")));
        });
        _$jscoverage_done("lib/rabbit-service.js", 70);
        RabbitMQ.utility.each(self.get("settings.bin"), function(value, key) {
            _$jscoverage_done("lib/rabbit-service.js", 71);
            self.set("settings.bin." + key, RabbitMQ.utility.realpath(value) || RabbitMQ.utility.absolute_path("../.dynamic/" + key, self.get("module_root")));
        });
        _$jscoverage_done("lib/rabbit-service.js", 75);
        self.set("validation", RabbitMQ.utility.validate(self.get("settings"), RabbitMQ._schemas.service));
        _$jscoverage_done("lib/rabbit-service.js", 78);
        if (_$jscoverage_done("lib/rabbit-service.js", 78, !self.get("validation").is_valid)) {
            _$jscoverage_done("lib/rabbit-service.js", 79);
            throw new Error("Validation Failure: " + validation.errors.join());
        }
        _$jscoverage_done("lib/rabbit-service.js", 83);
        self = new callback(null, self);
        _$jscoverage_done("lib/rabbit-service.js", 86);
        self.process = RabbitMQ.utility.spawn(self.get("bin.server"), [ "_detached" ], {
            cwd: process.cwd(),
            env: RabbitMQ.utility.extend({}, process.env, {
                RABBITMQ_CONFIG_FILE: self.get("settings.directories.config") + "/rabbitmq",
                RABBITMQ_PID_FILE: self.get("settings.directories.pid") + "/rabbitmq",
                RABBITMQ_MNESIA_DIR: self.get("settings.directories.cache"),
                RABBITMQ_NODE_PORT: self.get("settings.port"),
                RABBITMQ_NODE_IP_ADDRESS: self.get("settings.host"),
                RABBITMQ_NODENAME: self.get("name"),
                RABBITMQ_LOG_BASE: self.get("settings.directories.logs")
            }),
            detached: false
        });
        _$jscoverage_done("lib/rabbit-service.js", 101);
        self.set("process", RabbitMQ.utility.pick(self.process, "pid", "connected"));
        _$jscoverage_done("lib/rabbit-service.js", 103);
        self.process.on("exit", function() {
            _$jscoverage_done("lib/rabbit-service.js", 104);
            self.emit("service.exit", arguments);
        });
        _$jscoverage_done("lib/rabbit-service.js", 108);
        self.process.stdout.on("data", function(data) {
            _$jscoverage_done("lib/rabbit-service.js", 109);
            self.log("DATA:", data.toString());
        });
        _$jscoverage_done("lib/rabbit-service.js", 113);
        self.process.stderr.on("data", function(data) {
            _$jscoverage_done("lib/rabbit-service.js", 114);
            self.log("ERROR:", data.toString());
        });
        _$jscoverage_done("lib/rabbit-service.js", 117);
        process.nextTick(function() {
            _$jscoverage_done("lib/rabbit-service.js", 118);
            self.emit("service.starting");
        });
        _$jscoverage_done("lib/rabbit-service.js", 122);
        RabbitMQ._instance[self.get("settings.name")] = self;
    } catch (error) {
        _$jscoverage_done("lib/rabbit-service.js", 125);
        console.error(error.message);
        _$jscoverage_done("lib/rabbit-service.js", 126);
        return self;
    }
    _$jscoverage_done("lib/rabbit-service.js", 130);
    return self;
}

_$jscoverage_done("lib/rabbit-service.js", 138);
Object.defineProperties(RabbitMQ.prototype, {
    stop: {
        value: function log() {
            _$jscoverage_done("lib/rabbit-service.js", 148);
            this.debug("Stopping Service [%s].", this.get("process.pid"));
            _$jscoverage_done("lib/rabbit-service.js", 149);
            process.kill(this.get("process.pid"), "SIGHUP");
        },
        enumerable: true
    },
    log: {
        value: function log() {
            _$jscoverage_done("lib/rabbit-service.js", 162);
            return console.log.apply(console, arguments);
            _$jscoverage_done("lib/rabbit-service.js", 163);
            return require("winston").log.apply(null, arguments);
        },
        enumerable: true
    },
    debug: {
        value: require("debug")("rabbitmq:lient"),
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
    registerJob: {
        value: function registerJob() {},
        enumerable: true
    },
    runJob: {
        value: function registerJob() {},
        enumerable: true
    },
    manage: {
        value: function registerJob() {},
        enumerable: true
    },
    configure: {
        value: function configure(callback) {
            _$jscoverage_done("lib/rabbit-service.js", 257);
            this.on("ready", callback);
        },
        enumerable: true
    }
});

_$jscoverage_done("lib/rabbit-service.js", 267);
Object.defineProperties(module.exports = RabbitMQ, {
    create: {
        value: function create(settings, callback) {
            _$jscoverage_done("lib/rabbit-service.js", 276);
            return new RabbitMQ(settings, callback);
        },
        enumerable: false
    },
    debug: {
        value: require("debug")("rabbitmq:constructor"),
        enumerable: true
    },
    destroy: {
        value: function destroy(pid) {
            _$jscoverage_done("lib/rabbit-service.js", 298);
            RabbitMQ.debug("destroy [%s]", pid);
        },
        enumerable: true
    },
    utility: {
        value: require("./utility"),
        enumerable: false
    },
    startService: {
        get: function startService() {
            _$jscoverage_done("lib/rabbit-service.js", 319);
            return RabbitMQ.create;
        },
        enumerable: true
    },
    createClient: {
        value: function createClient(settings, callback) {
            _$jscoverage_done("lib/rabbit-service.js", 331);
            console.log("asdf");
        },
        enumerable: true
    },
    getInstance: {
        value: function getInstance(pid) {
            _$jscoverage_done("lib/rabbit-service.js", 343);
            return RabbitMQ.__instances ? RabbitMQ.__instances[pid] : null;
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