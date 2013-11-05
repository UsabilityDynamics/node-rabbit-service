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
_$jscoverage_init(_$jscoverage, "lib/rabbitmq-client.js",[16,18,19,22,25,26,27,30,31,32,33,35,38,39,43,47,50,51,55,63,72,152,161,183,204,216,228]);
_$jscoverage_init(_$jscoverage_cond, "lib/rabbitmq-client.js",[38]);
_$jscoverage["lib/rabbitmq-client.js"].source = ["/**"," * RabbitMQ Service Constructor"," *"," * @class RabbitMQ"," * @constructor"," * @version 3.2.0"," * @async"," *"," * @param settings {Object} Configuration settings."," * @param callback {Function} Callback function."," *"," * @returns {RabbitMQ}"," * @constructor"," */","function RabbitMQ() {","  this.debug( 'Creating service with [%s].', 'function' === typeof child ? child.name : typeof child );","","  var settings = 'object' === typeof arguments[0] ? arguments[0] : {};","  var callback = 'function' === typeof arguments[1] ? arguments[1] : RabbitMQ.utility.noop;","","  // Extend settings with defaults","  RabbitMQ.utility.defaults( settings, require( '../package' ).config );","","  // Extend child's prototype with RabbitMQ, Object Emitter and Object Settings","  RabbitMQ.utility.inherits( callback, RabbitMQ );","  RabbitMQ.utility.emitter.mixin( callback.prototype );","  RabbitMQ.utility.settings.mixin( callback.prototype  );","","  // Instance Settings","  callback.prototype.set( 'validation', RabbitMQ.utility.validate.validate( settings, RabbitMQ._schemas.service ) );","  callback.prototype.set( 'settings', settings );","  callback.prototype.set( 'id', RabbitMQ.utility.hash( settings ) );","  callback.prototype.set( 'pid', undefined );","","  try {","","    // Validate Settings","    if( !callback.prototype.get( 'validation' ).is_valid ) {","      throw new Error( 'Validation Failure: ' + validation.errors.join() );","    }","","    // Instantaite the extended Child Service","    callback = new callback( null, callback.prototype );","","","    // Successful service initialized - record instance.","    RabbitMQ._instance[ callback.get( 'id' ) ] = callback;","","  } catch( error ) {","    console.error( error.message );","    return error;","  }","","  // @chainable","  return callback;","","}","","/**"," * Instance Properties"," *"," */","Object.defineProperties( RabbitMQ.prototype, {","  log: {","    /**","     * Log Entry","     *","     * @method log","     * @for RabbitMQ.prototype","     */","    value: function log() {","      return require( 'winston' ).log.apply( null, arguments )","    },","    enumerable: true","  },","  debug: {","    /**","     * Debug Entry","     *","     * @method debug","     * @for RabbitMQ.prototype","     */","    value: require( 'debug' )( 'rabbitmq:lient' ),","    enumerable: true","  },","  createClient: {","    /**","     * Create Client","     *","     * @method createClient","     * @for RabbitMQ.prototype","     */","    value: function createClient() {","","    },","    enumerable: true","  },","  registerJob: {","    /**","     * Create Job","     *","     * @method registerJob","     * @for RabbitMQ.prototype","     */","    value: function registerJob() {","","    },","    enumerable: true","  },","  runJob: {","    /**","     * Create Job","     *","     * @method registerJob","     * @for RabbitMQ.prototype","     */","    value: function registerJob() {","","    },","    enumerable: true","  },","  manage: {","    /**","     * Create Job","     *","     * @method registerJob","     * @for RabbitMQ.prototype","     */","    value: function registerJob() {","","    },","    enumerable: true","  },","  configure: {","    /**","     * Create Configuration Callback","     *","     * @method configure","     * @for RabbitMQ.prototype","     */","    value: function configure() {","","    },","    enumerable: true","  }","});","","/**"," * Constructor Properties"," *"," */","Object.defineProperties( module.exports = RabbitMQ, {","  create: {","    /**","     * Create Instance","     *","     * @method create","     * @for RabbitMQ","     */","    value: function create( settings, callback ) {","      return new RabbitMQ( settings, callback );","    },","    enumerable: false","  },","  debug: {","    /**","     * Constructor Debugger","     *","     * @method debug","     * @for RabbitMQ","     */","    value: require( 'debug' )( 'rabbitmq:constructor' ),","    enumerable: true","  },","  destroy: {","    /**","     * Destroy Instance","     *","     * @method create","     * @for RabbitMQ","     */","    value: function destroy( pid ) {","      RabbitMQ.debug( 'destroy [%s]', pid );","    },","    enumerable: true","  },","  utility: {","    /**","     * Utility Methods","     *","     * @for RabbitMQ","     */","    value: require( './utility' ),","    enumerable: false","  },","  startService: {","    /**","     * Create Instance","     *","     * @method create","     * @for RabbitMQ","     */","    value: function startService( settings, callback ) {","      return RabbitMQ.create( settings, callback );","    },","    enumerable: true","  },","  createClient: {","    /**","     * Create Generic Client","     *","     * @method createClient","     * @for RabbitMQ","     */","    value: function createClient( settings, callback ) {","      console.log( 'asdf' );","    },","    enumerable: true","  },","  getInstance: {","    /**","     * Get Instance by PID","     *","     * @method create","     * @for RabbitMQ","     */","    value: function getInstance( pid ) {","      return RabbitMQ.__instances ? RabbitMQ.__instances[ pid ] : null;","    },","    enumerable: false","  },","  _schemas: {","    /**","     * Schemas","     *","     * @attribute _schemas","     * @type object","     */","    value: {","      service: require( '../static/schemas/service' ),","      job: require( '../static/schemas/job' )","    },","    enumerable: false,","    writable: false","  },","  _instance: {","    /**","     * Instance Map","     *","     * @attribute _instance","     * @type object","     */","    value: {},","    enumerable: false,","    writable: true","  }","});"];
function RabbitMQ() {
    _$jscoverage_done("lib/rabbitmq-client.js", 16);
    this.debug("Creating service with [%s].", "function" === typeof child ? child.name : typeof child);
    _$jscoverage_done("lib/rabbitmq-client.js", 18);
    var settings = "object" === typeof arguments[0] ? arguments[0] : {};
    _$jscoverage_done("lib/rabbitmq-client.js", 19);
    var callback = "function" === typeof arguments[1] ? arguments[1] : RabbitMQ.utility.noop;
    _$jscoverage_done("lib/rabbitmq-client.js", 22);
    RabbitMQ.utility.defaults(settings, require("../package").config);
    _$jscoverage_done("lib/rabbitmq-client.js", 25);
    RabbitMQ.utility.inherits(callback, RabbitMQ);
    _$jscoverage_done("lib/rabbitmq-client.js", 26);
    RabbitMQ.utility.emitter.mixin(callback.prototype);
    _$jscoverage_done("lib/rabbitmq-client.js", 27);
    RabbitMQ.utility.settings.mixin(callback.prototype);
    _$jscoverage_done("lib/rabbitmq-client.js", 30);
    callback.prototype.set("validation", RabbitMQ.utility.validate.validate(settings, RabbitMQ._schemas.service));
    _$jscoverage_done("lib/rabbitmq-client.js", 31);
    callback.prototype.set("settings", settings);
    _$jscoverage_done("lib/rabbitmq-client.js", 32);
    callback.prototype.set("id", RabbitMQ.utility.hash(settings));
    _$jscoverage_done("lib/rabbitmq-client.js", 33);
    callback.prototype.set("pid", undefined);
    _$jscoverage_done("lib/rabbitmq-client.js", 35);
    try {
        _$jscoverage_done("lib/rabbitmq-client.js", 38);
        if (_$jscoverage_done("lib/rabbitmq-client.js", 38, !callback.prototype.get("validation").is_valid)) {
            _$jscoverage_done("lib/rabbitmq-client.js", 39);
            throw new Error("Validation Failure: " + validation.errors.join());
        }
        _$jscoverage_done("lib/rabbitmq-client.js", 43);
        callback = new callback(null, callback.prototype);
        _$jscoverage_done("lib/rabbitmq-client.js", 47);
        RabbitMQ._instance[callback.get("id")] = callback;
    } catch (error) {
        _$jscoverage_done("lib/rabbitmq-client.js", 50);
        console.error(error.message);
        _$jscoverage_done("lib/rabbitmq-client.js", 51);
        return error;
    }
    _$jscoverage_done("lib/rabbitmq-client.js", 55);
    return callback;
}

_$jscoverage_done("lib/rabbitmq-client.js", 63);
Object.defineProperties(RabbitMQ.prototype, {
    log: {
        value: function log() {
            _$jscoverage_done("lib/rabbitmq-client.js", 72);
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

_$jscoverage_done("lib/rabbitmq-client.js", 152);
Object.defineProperties(module.exports = RabbitMQ, {
    create: {
        value: function create(settings, callback) {
            _$jscoverage_done("lib/rabbitmq-client.js", 161);
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
            _$jscoverage_done("lib/rabbitmq-client.js", 183);
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
            _$jscoverage_done("lib/rabbitmq-client.js", 204);
            return RabbitMQ.create(settings, callback);
        },
        enumerable: true
    },
    createClient: {
        value: function createClient(settings, callback) {
            _$jscoverage_done("lib/rabbitmq-client.js", 216);
            console.log("asdf");
        },
        enumerable: true
    },
    getInstance: {
        value: function getInstance(pid) {
            _$jscoverage_done("lib/rabbitmq-client.js", 228);
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