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
_$jscoverage_init(_$jscoverage, "lib/rabbitmq-service.js",[16,19,20,23,24,25,26,29,31,34,37,38,41,48,61,62,66,67,71,74,75,79,82,97,98,102,103,107,110,113,114,118,126,136,137,231,241,250,272,293,305,317]);
_$jscoverage_init(_$jscoverage_cond, "lib/rabbitmq-service.js",[19,74]);
_$jscoverage["lib/rabbitmq-service.js"].source = ["/**"," * RabbitMQ Service Constructor"," *"," * @class RabbitMQ"," * @constructor"," * @version 3.2.0"," * @async"," *"," * @param settings {Object} Configuration settings."," * @param callback {Function} Callback function."," *"," * @returns {RabbitMQ}"," * @constructor"," */","function RabbitMQ() {","  this.debug( 'Creating service with [%s].', 'function' === typeof child ? child.name : typeof child );","","  // Make sure context is correct otherwise we could screw up the global scope.","  if( !( this instanceof RabbitMQ ) ) {","    return new RabbitMQ( arguments[0], arguments[1] );","  }","","  var path      = require( 'path' );","  var settings  = 'object' === typeof arguments[0] ? arguments[0] : {};","  var callback  = 'function' === typeof arguments[1] ? arguments[1] : RabbitMQ.utility.noop;","  var self      = this;","","  // Extend child's prototype with RabbitMQ, Object Emitter and Object Settings","  RabbitMQ.utility.inherits( callback, RabbitMQ );","","  try {","","    // Until the callback is instantiated we refere to its prototype","    self = callback.prototype;","","    // Mixins.","    RabbitMQ.utility.emitter.mixin( self);","    RabbitMQ.utility.settings.mixin( self );","","    // Instante Settings.","    self.set({","      settings: RabbitMQ.utility.defaults( settings, require( '../package' ).config ),","      module_root: path.dirname( path.dirname( module.filename ) ),","      distribution: 'rabbitmq-3.2.0-mac'","    });","","    // Computed Settings.","    self.set({","      id: RabbitMQ.utility.hash( settings ),","      name: [ self.get( 'settings.name' ), self.get( 'settings.hostname', 'localhost' ) ].join( '@' ),","      bin: {","        ctl: RabbitMQ.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), \"sbin/rabbitmqctl\" ),","        defaults: RabbitMQ.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), \"sbin/rabbitmq-defaults\" ),","        env: RabbitMQ.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), \"sbin/rabbitmq-env\" ),","        plugins: RabbitMQ.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), \"sbin/rabbitmq-plugins\" ),","        server: RabbitMQ.utility.realpath( self.get( 'module_root' ), 'vendor', self.get( 'distribution' ), \"sbin/rabbitmq-server\" )","      }","    });","","    // Compute absolute paths to directories","    RabbitMQ.utility.each( self.get( 'settings.directories' ), function( value, key ) {","      self.set( 'settings.directories.' + key, RabbitMQ.utility.realpath( value ) || RabbitMQ.utility.absolute_path( '../.dynamic/' + key, self.get( 'module_root' ) ) )","    });","","    // Compute absolute paths to directories","    RabbitMQ.utility.each( self.get( 'settings.bin' ), function( value, key ) {","      self.set( 'settings.bin.' + key, RabbitMQ.utility.realpath( value ) || RabbitMQ.utility.absolute_path( '../.dynamic/' + key, self.get( 'module_root' ) ) )","    });","","    // Validate Settings","    self.set( 'validation', RabbitMQ.utility.validate( self.get( 'settings' ), RabbitMQ._schemas.service ) );","","    // Validate Settings","    if( !self.get( 'validation' ).is_valid ) {","      throw new Error( 'Validation Failure: ' + validation.errors.join() );","    }","","    // Instantaite the callback","    self = new callback( null, self );","","    // Spawn RabbitMQ Server Process.","    self.process = RabbitMQ.utility.spawn( self.get( 'bin.server' ), [ \"_detached\" ], {","      cwd: process.cwd(),","      env: RabbitMQ.utility.extend( {}, process.env, {","        RABBITMQ_CONFIG_FILE: self.get( 'settings.directories.config' ) + '/rabbitmq',","        RABBITMQ_PID_FILE: self.get( 'settings.directories.pid' ) + '/rabbitmq',","        RABBITMQ_MNESIA_DIR: self.get( 'settings.directories.cache' ),","        RABBITMQ_NODE_PORT: self.get( 'settings.port' ),","        RABBITMQ_NODE_IP_ADDRESS: self.get( 'settings.host' ),","        RABBITMQ_NODENAME: self.get( 'name' ),","        RABBITMQ_LOG_BASE: self.get( 'settings.directories.logs' )","      }),","      detached: false","    });","","    // Try to parse JSON, Output Data","    self.process.stdout.on( 'data', function( data ) {","      self.log( 'DATA:', data.toString() );","    });","","    // Try to parse JSON, Output Error","    self.process.stderr.on( 'data', function( data ) {","      self.log( 'ERROR:', data.toString() );","    });","","    // Update settings after process spawned.","    self.set( 'process', RabbitMQ.utility.pick( self.process, 'pid', 'connected' ) );","","    // Save instance.","    RabbitMQ._instance[ self.get( 'settings.name' ) ] = self;","","  } catch( error ) {","    console.error( error.message );","    return self;","  }","","  // @chainable","  return self;","","}","","/**"," * Instance Properties"," *"," */","Object.defineProperties( RabbitMQ.prototype, {","  log: {","    /**","     * Log Entry","     *","     * @method log","     * @uses winston","     * @for RabbitMQ.prototype","     */","    value: function log() {","      return console.log.apply( console, arguments );","      return require( 'winston' ).log.apply( null, arguments )","    },","    enumerable: true","  },","  debug: {","    /**","     * Debug Entry","     *","     * @method debug","     * @for RabbitMQ.prototype","     */","    value: require( 'debug' )( 'rabbitmq:lient' ),","    enumerable: true","  },","  createProducer: {","    /**","     * Create Client","     *","     * @method createClient","     * @for RabbitMQ.prototype","     */","    value: function createClient() {","","    },","    enumerable: true","  },","  createConsumer: {","    /**","     * Create Client","     *","     * @method createClient","     * @for RabbitMQ.prototype","     */","    value: function createClient() {","","    },","    enumerable: true","  },","  createClient: {","    /**","     * Create Client","     *","     * @method createClient","     * @for RabbitMQ.prototype","     */","    value: function createClient() {","","    },","    enumerable: true","  },","  registerJob: {","    /**","     * Create Job","     *","     * @method registerJob","     * @for RabbitMQ.prototype","     */","    value: function registerJob() {","","    },","    enumerable: true","  },","  runJob: {","    /**","     * Create Job","     *","     * @method registerJob","     * @for RabbitMQ.prototype","     */","    value: function registerJob() {","","    },","    enumerable: true","  },","  manage: {","    /**","     * Create Job","     *","     * @method registerJob","     * @for RabbitMQ.prototype","     */","    value: function registerJob() {","","    },","    enumerable: true","  },","  configure: {","    /**","     * Create Configuration Callback","     *","     * @method configure","     * @for RabbitMQ.prototype","     */","    value: function configure( callback ) {","      this.on( 'ready', callback );","    },","    enumerable: true","  }","});","","/**"," * Constructor Properties"," *"," */","Object.defineProperties( module.exports = RabbitMQ, {","  create: {","    /**","     * Create Instance","     *","     * @method create","     * @for RabbitMQ","     */","    value: function create( settings, callback ) {","      return new RabbitMQ( settings, callback );","    },","    enumerable: false","  },","  debug: {","    /**","     * Constructor Debugger","     *","     * @method debug","     * @for RabbitMQ","     */","    value: require( 'debug' )( 'rabbitmq:constructor' ),","    enumerable: true","  },","  destroy: {","    /**","     * Destroy Instance","     *","     * @method create","     * @for RabbitMQ","     */","    value: function destroy( pid ) {","      RabbitMQ.debug( 'destroy [%s]', pid );","    },","    enumerable: true","  },","  utility: {","    /**","     * Utility Methods","     *","     * @for RabbitMQ","     */","    value: require( './utility' ),","    enumerable: false","  },","  startService: {","    /**","     * Create Instance","     *","     * @method create","     * @for RabbitMQ","     */","    get: function startService() {","      return RabbitMQ.create;","    },","    enumerable: true","  },","  createClient: {","    /**","     * Create Generic Client","     *","     * @method createClient","     * @for RabbitMQ","     */","    value: function createClient( settings, callback ) {","      console.log( 'asdf' );","    },","    enumerable: true","  },","  getInstance: {","    /**","     * Get Instance by PID","     *","     * @method create","     * @for RabbitMQ","     */","    value: function getInstance( pid ) {","      return RabbitMQ.__instances ? RabbitMQ.__instances[ pid ] : null;","    },","    enumerable: false","  },","  _schemas: {","    /**","     * Schemas","     *","     * @attribute _schemas","     * @type object","     */","    value: {","      service: require( '../static/schemas/service' ),","      job: require( '../static/schemas/job' )","    },","    enumerable: false,","    writable: false","  },","  _instance: {","    /**","     * Instance Map","     *","     * @attribute _instance","     * @type object","     */","    value: {},","    enumerable: false,","    writable: true","  }","});","",""];
function RabbitMQ() {
    _$jscoverage_done("lib/rabbitmq-service.js", 16);
    this.debug("Creating service with [%s].", "function" === typeof child ? child.name : typeof child);
    _$jscoverage_done("lib/rabbitmq-service.js", 19);
    if (_$jscoverage_done("lib/rabbitmq-service.js", 19, !(this instanceof RabbitMQ))) {
        _$jscoverage_done("lib/rabbitmq-service.js", 20);
        return new RabbitMQ(arguments[0], arguments[1]);
    }
    _$jscoverage_done("lib/rabbitmq-service.js", 23);
    var path = require("path");
    _$jscoverage_done("lib/rabbitmq-service.js", 24);
    var settings = "object" === typeof arguments[0] ? arguments[0] : {};
    _$jscoverage_done("lib/rabbitmq-service.js", 25);
    var callback = "function" === typeof arguments[1] ? arguments[1] : RabbitMQ.utility.noop;
    _$jscoverage_done("lib/rabbitmq-service.js", 26);
    var self = this;
    _$jscoverage_done("lib/rabbitmq-service.js", 29);
    RabbitMQ.utility.inherits(callback, RabbitMQ);
    _$jscoverage_done("lib/rabbitmq-service.js", 31);
    try {
        _$jscoverage_done("lib/rabbitmq-service.js", 34);
        self = callback.prototype;
        _$jscoverage_done("lib/rabbitmq-service.js", 37);
        RabbitMQ.utility.emitter.mixin(self);
        _$jscoverage_done("lib/rabbitmq-service.js", 38);
        RabbitMQ.utility.settings.mixin(self);
        _$jscoverage_done("lib/rabbitmq-service.js", 41);
        self.set({
            settings: RabbitMQ.utility.defaults(settings, require("../package").config),
            module_root: path.dirname(path.dirname(module.filename)),
            distribution: "rabbitmq-3.2.0-mac"
        });
        _$jscoverage_done("lib/rabbitmq-service.js", 48);
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
        _$jscoverage_done("lib/rabbitmq-service.js", 61);
        RabbitMQ.utility.each(self.get("settings.directories"), function(value, key) {
            _$jscoverage_done("lib/rabbitmq-service.js", 62);
            self.set("settings.directories." + key, RabbitMQ.utility.realpath(value) || RabbitMQ.utility.absolute_path("../.dynamic/" + key, self.get("module_root")));
        });
        _$jscoverage_done("lib/rabbitmq-service.js", 66);
        RabbitMQ.utility.each(self.get("settings.bin"), function(value, key) {
            _$jscoverage_done("lib/rabbitmq-service.js", 67);
            self.set("settings.bin." + key, RabbitMQ.utility.realpath(value) || RabbitMQ.utility.absolute_path("../.dynamic/" + key, self.get("module_root")));
        });
        _$jscoverage_done("lib/rabbitmq-service.js", 71);
        self.set("validation", RabbitMQ.utility.validate(self.get("settings"), RabbitMQ._schemas.service));
        _$jscoverage_done("lib/rabbitmq-service.js", 74);
        if (_$jscoverage_done("lib/rabbitmq-service.js", 74, !self.get("validation").is_valid)) {
            _$jscoverage_done("lib/rabbitmq-service.js", 75);
            throw new Error("Validation Failure: " + validation.errors.join());
        }
        _$jscoverage_done("lib/rabbitmq-service.js", 79);
        self = new callback(null, self);
        _$jscoverage_done("lib/rabbitmq-service.js", 82);
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
        _$jscoverage_done("lib/rabbitmq-service.js", 97);
        self.process.stdout.on("data", function(data) {
            _$jscoverage_done("lib/rabbitmq-service.js", 98);
            self.log("DATA:", data.toString());
        });
        _$jscoverage_done("lib/rabbitmq-service.js", 102);
        self.process.stderr.on("data", function(data) {
            _$jscoverage_done("lib/rabbitmq-service.js", 103);
            self.log("ERROR:", data.toString());
        });
        _$jscoverage_done("lib/rabbitmq-service.js", 107);
        self.set("process", RabbitMQ.utility.pick(self.process, "pid", "connected"));
        _$jscoverage_done("lib/rabbitmq-service.js", 110);
        RabbitMQ._instance[self.get("settings.name")] = self;
    } catch (error) {
        _$jscoverage_done("lib/rabbitmq-service.js", 113);
        console.error(error.message);
        _$jscoverage_done("lib/rabbitmq-service.js", 114);
        return self;
    }
    _$jscoverage_done("lib/rabbitmq-service.js", 118);
    return self;
}

_$jscoverage_done("lib/rabbitmq-service.js", 126);
Object.defineProperties(RabbitMQ.prototype, {
    log: {
        value: function log() {
            _$jscoverage_done("lib/rabbitmq-service.js", 136);
            return console.log.apply(console, arguments);
            _$jscoverage_done("lib/rabbitmq-service.js", 137);
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
            _$jscoverage_done("lib/rabbitmq-service.js", 231);
            this.on("ready", callback);
        },
        enumerable: true
    }
});

_$jscoverage_done("lib/rabbitmq-service.js", 241);
Object.defineProperties(module.exports = RabbitMQ, {
    create: {
        value: function create(settings, callback) {
            _$jscoverage_done("lib/rabbitmq-service.js", 250);
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
            _$jscoverage_done("lib/rabbitmq-service.js", 272);
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
            _$jscoverage_done("lib/rabbitmq-service.js", 293);
            return RabbitMQ.create;
        },
        enumerable: true
    },
    createClient: {
        value: function createClient(settings, callback) {
            _$jscoverage_done("lib/rabbitmq-service.js", 305);
            console.log("asdf");
        },
        enumerable: true
    },
    getInstance: {
        value: function getInstance(pid) {
            _$jscoverage_done("lib/rabbitmq-service.js", 317);
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