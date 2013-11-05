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
_$jscoverage_init(_$jscoverage, "lib/rabbitmq-client.js",[16,18,19,20,23,25,28,30,31,34,37,38,42,45,48,49,53,56,58,65,66,70,71,75,78,81,82,85,93,103,104,184,193,215,236,248,260]);
_$jscoverage_init(_$jscoverage_cond, "lib/rabbitmq-client.js",[48]);
_$jscoverage["lib/rabbitmq-client.js"].source = ["/**"," * RabbitMQ Service Constructor"," *"," * @class RabbitMQ"," * @constructor"," * @version 3.2.0"," * @async"," *"," * @param settings {Object} Configuration settings."," * @param callback {Function} Callback function."," *"," * @returns {RabbitMQ}"," * @constructor"," */","function RabbitMQ() {","  this.debug( 'Creating service with [%s].', 'function' === typeof child ? child.name : typeof child );","","  var settings  = 'object' === typeof arguments[0] ? arguments[0] : {};","  var callback  = 'function' === typeof arguments[1] ? arguments[1] : RabbitMQ.utility.noop;","  var self      = this;","","  // Extend child's prototype with RabbitMQ, Object Emitter and Object Settings","  RabbitMQ.utility.inherits( callback, RabbitMQ );","","  try {","","    // Until the callback is instantiated we refere to its prototype","    self = callback.prototype;","","    RabbitMQ.utility.emitter.mixin( self);","    RabbitMQ.utility.settings.mixin( self  );","","    // Extend settings with defaults","    self.set( 'settings', RabbitMQ.utility.defaults( settings, require( '../package' ).config ) );","","    // Compute absolute paths to directories","    RabbitMQ.utility.each( self.get( 'settings.directories' ), function( value, key ) {","      self.set( 'settings.directories.' + key, RabbitMQ.utility.realpath( value ) || RabbitMQ.utility.realpath( '../.dynamic/' + key ) )","    });","","    // Validate Settings","    self.set( 'validation', RabbitMQ.utility.validate( self.get( 'settings' ), RabbitMQ._schemas.service ) );","","    // Prepare PID","    self.set( 'pid', undefined );","","    // Validate Settings","    if( !self.get( 'validation' ).is_valid ) {","      throw new Error( 'Validation Failure: ' + validation.errors.join() );","    }","","    // Generate Instance ID from settings","    self.set( 'id', RabbitMQ.utility.hash( self.get( 'settings' ) ) );","","    // Instantaite the callback","    self = RabbitMQ._instance[ self.get( 'id' ) ] = new callback( null, self );","","    self.process = RabbitMQ.utility.spawn( 'ls', [], {","      cwd: process.cwd(),","      env: process.env,","      detached: false","    });","","    // Try to parse JSON, Output Data","    self.process.stdout.on( 'data', function( data ) {","      self.log( 'data', data.toString() );","    });","","    // Try to parse JSON, Output Error","    self.process.stderr.on( 'data', function( data ) {","      self.log( 'error', data.toString() );","    });","","    // Set PID","    self.set( 'pid', self.process.pid );","","    // @chainable","    return self;","","  } catch( error ) {","    console.error( error.message );","    return self;","  }","","  return self;","","}","","/**"," * Instance Properties"," *"," */","Object.defineProperties( RabbitMQ.prototype, {","  log: {","    /**","     * Log Entry","     *","     * @method log","     * @uses winston","     * @for RabbitMQ.prototype","     */","    value: function log() {","      return console.log.apply( console, arguments );","      return require( 'winston' ).log.apply( null, arguments )","    },","    enumerable: true","  },","  debug: {","    /**","     * Debug Entry","     *","     * @method debug","     * @for RabbitMQ.prototype","     */","    value: require( 'debug' )( 'rabbitmq:lient' ),","    enumerable: true","  },","  createClient: {","    /**","     * Create Client","     *","     * @method createClient","     * @for RabbitMQ.prototype","     */","    value: function createClient() {","","    },","    enumerable: true","  },","  registerJob: {","    /**","     * Create Job","     *","     * @method registerJob","     * @for RabbitMQ.prototype","     */","    value: function registerJob() {","","    },","    enumerable: true","  },","  runJob: {","    /**","     * Create Job","     *","     * @method registerJob","     * @for RabbitMQ.prototype","     */","    value: function registerJob() {","","    },","    enumerable: true","  },","  manage: {","    /**","     * Create Job","     *","     * @method registerJob","     * @for RabbitMQ.prototype","     */","    value: function registerJob() {","","    },","    enumerable: true","  },","  configure: {","    /**","     * Create Configuration Callback","     *","     * @method configure","     * @for RabbitMQ.prototype","     */","    value: function configure() {","","    },","    enumerable: true","  }","});","","/**"," * Constructor Properties"," *"," */","Object.defineProperties( module.exports = RabbitMQ, {","  create: {","    /**","     * Create Instance","     *","     * @method create","     * @for RabbitMQ","     */","    value: function create( settings, callback ) {","      return new RabbitMQ( settings, callback );","    },","    enumerable: false","  },","  debug: {","    /**","     * Constructor Debugger","     *","     * @method debug","     * @for RabbitMQ","     */","    value: require( 'debug' )( 'rabbitmq:constructor' ),","    enumerable: true","  },","  destroy: {","    /**","     * Destroy Instance","     *","     * @method create","     * @for RabbitMQ","     */","    value: function destroy( pid ) {","      RabbitMQ.debug( 'destroy [%s]', pid );","    },","    enumerable: true","  },","  utility: {","    /**","     * Utility Methods","     *","     * @for RabbitMQ","     */","    value: require( './utility' ),","    enumerable: false","  },","  startService: {","    /**","     * Create Instance","     *","     * @method create","     * @for RabbitMQ","     */","    value: function startService( settings, callback ) {","      return RabbitMQ.create( settings, callback );","    },","    enumerable: true","  },","  createClient: {","    /**","     * Create Generic Client","     *","     * @method createClient","     * @for RabbitMQ","     */","    value: function createClient( settings, callback ) {","      console.log( 'asdf' );","    },","    enumerable: true","  },","  getInstance: {","    /**","     * Get Instance by PID","     *","     * @method create","     * @for RabbitMQ","     */","    value: function getInstance( pid ) {","      return RabbitMQ.__instances ? RabbitMQ.__instances[ pid ] : null;","    },","    enumerable: false","  },","  _schemas: {","    /**","     * Schemas","     *","     * @attribute _schemas","     * @type object","     */","    value: {","      service: require( '../static/schemas/service' ),","      job: require( '../static/schemas/job' )","    },","    enumerable: false,","    writable: false","  },","  _instance: {","    /**","     * Instance Map","     *","     * @attribute _instance","     * @type object","     */","    value: {},","    enumerable: false,","    writable: true","  }","});"];
function RabbitMQ() {
    _$jscoverage_done("lib/rabbitmq-client.js", 16);
    this.debug("Creating service with [%s].", "function" === typeof child ? child.name : typeof child);
    _$jscoverage_done("lib/rabbitmq-client.js", 18);
    var settings = "object" === typeof arguments[0] ? arguments[0] : {};
    _$jscoverage_done("lib/rabbitmq-client.js", 19);
    var callback = "function" === typeof arguments[1] ? arguments[1] : RabbitMQ.utility.noop;
    _$jscoverage_done("lib/rabbitmq-client.js", 20);
    var self = this;
    _$jscoverage_done("lib/rabbitmq-client.js", 23);
    RabbitMQ.utility.inherits(callback, RabbitMQ);
    _$jscoverage_done("lib/rabbitmq-client.js", 25);
    try {
        _$jscoverage_done("lib/rabbitmq-client.js", 28);
        self = callback.prototype;
        _$jscoverage_done("lib/rabbitmq-client.js", 30);
        RabbitMQ.utility.emitter.mixin(self);
        _$jscoverage_done("lib/rabbitmq-client.js", 31);
        RabbitMQ.utility.settings.mixin(self);
        _$jscoverage_done("lib/rabbitmq-client.js", 34);
        self.set("settings", RabbitMQ.utility.defaults(settings, require("../package").config));
        _$jscoverage_done("lib/rabbitmq-client.js", 37);
        RabbitMQ.utility.each(self.get("settings.directories"), function(value, key) {
            _$jscoverage_done("lib/rabbitmq-client.js", 38);
            self.set("settings.directories." + key, RabbitMQ.utility.realpath(value) || RabbitMQ.utility.realpath("../.dynamic/" + key));
        });
        _$jscoverage_done("lib/rabbitmq-client.js", 42);
        self.set("validation", RabbitMQ.utility.validate(self.get("settings"), RabbitMQ._schemas.service));
        _$jscoverage_done("lib/rabbitmq-client.js", 45);
        self.set("pid", undefined);
        _$jscoverage_done("lib/rabbitmq-client.js", 48);
        if (_$jscoverage_done("lib/rabbitmq-client.js", 48, !self.get("validation").is_valid)) {
            _$jscoverage_done("lib/rabbitmq-client.js", 49);
            throw new Error("Validation Failure: " + validation.errors.join());
        }
        _$jscoverage_done("lib/rabbitmq-client.js", 53);
        self.set("id", RabbitMQ.utility.hash(self.get("settings")));
        _$jscoverage_done("lib/rabbitmq-client.js", 56);
        self = RabbitMQ._instance[self.get("id")] = new callback(null, self);
        _$jscoverage_done("lib/rabbitmq-client.js", 58);
        self.process = RabbitMQ.utility.spawn("ls", [], {
            cwd: process.cwd(),
            env: process.env,
            detached: false
        });
        _$jscoverage_done("lib/rabbitmq-client.js", 65);
        self.process.stdout.on("data", function(data) {
            _$jscoverage_done("lib/rabbitmq-client.js", 66);
            self.log("data", data.toString());
        });
        _$jscoverage_done("lib/rabbitmq-client.js", 70);
        self.process.stderr.on("data", function(data) {
            _$jscoverage_done("lib/rabbitmq-client.js", 71);
            self.log("error", data.toString());
        });
        _$jscoverage_done("lib/rabbitmq-client.js", 75);
        self.set("pid", self.process.pid);
        _$jscoverage_done("lib/rabbitmq-client.js", 78);
        return self;
    } catch (error) {
        _$jscoverage_done("lib/rabbitmq-client.js", 81);
        console.error(error.message);
        _$jscoverage_done("lib/rabbitmq-client.js", 82);
        return self;
    }
    _$jscoverage_done("lib/rabbitmq-client.js", 85);
    return self;
}

_$jscoverage_done("lib/rabbitmq-client.js", 93);
Object.defineProperties(RabbitMQ.prototype, {
    log: {
        value: function log() {
            _$jscoverage_done("lib/rabbitmq-client.js", 103);
            return console.log.apply(console, arguments);
            _$jscoverage_done("lib/rabbitmq-client.js", 104);
            return require("winston").log.apply(null, arguments);
        },
        enumerable: true
    },
    debug: {
        value: require("debug")("rabbitmq:lient"),
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
        value: function configure() {},
        enumerable: true
    }
});

_$jscoverage_done("lib/rabbitmq-client.js", 184);
Object.defineProperties(module.exports = RabbitMQ, {
    create: {
        value: function create(settings, callback) {
            _$jscoverage_done("lib/rabbitmq-client.js", 193);
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
            _$jscoverage_done("lib/rabbitmq-client.js", 215);
            RabbitMQ.debug("destroy [%s]", pid);
        },
        enumerable: true
    },
    utility: {
        value: require("./utility"),
        enumerable: false
    },
    startService: {
        value: function startService(settings, callback) {
            _$jscoverage_done("lib/rabbitmq-client.js", 236);
            return RabbitMQ.create(settings, callback);
        },
        enumerable: true
    },
    createClient: {
        value: function createClient(settings, callback) {
            _$jscoverage_done("lib/rabbitmq-client.js", 248);
            console.log("asdf");
        },
        enumerable: true
    },
    getInstance: {
        value: function getInstance(pid) {
            _$jscoverage_done("lib/rabbitmq-client.js", 260);
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