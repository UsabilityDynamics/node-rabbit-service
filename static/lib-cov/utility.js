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
_$jscoverage_init(_$jscoverage, "lib/utility.js",[7,13]);
_$jscoverage_init(_$jscoverage_cond, "lib/utility.js",[]);
_$jscoverage["lib/utility.js"].source = ["/**"," * RabbitMQ Client Utility Methods"," *"," * @class Utility"," * @uses Abstract"," */","var Utility = require( 'abstract' ).utility;","","/**"," * Extra Utility Methods"," *"," */","Object.defineProperties( module.exports = Utility, {","  spawn: {","    value: require( 'child_process' ).spawn,","    configurable: false,","    enumerable: true,","    writable: true","  },","  inherits: {","    value: require( 'util' ).inherits,","    configurable: false,","    enumerable: true,","    writable: true","  },","  settings: {","    value: require( 'object-settings' ),","    configurable: false,","    enumerable: true,","    writable: true","  },","  validate: {","    value: require( 'object-validation' ).validate,","    configurable: false,","    enumerable: true,","    writable: true","  },","  emitter: {","    value: require( 'object-emitter' ),","    configurable: false,","    enumerable: true,","    writable: true","  },","  request: {","    value: require( 'request' ),","    configurable: false,","    enumerable: true,","    writable: true","  }","});"];
_$jscoverage_done("lib/utility.js", 7);
var Utility = require("abstract").utility;

_$jscoverage_done("lib/utility.js", 13);
Object.defineProperties(module.exports = Utility, {
    spawn: {
        value: require("child_process").spawn,
        configurable: false,
        enumerable: true,
        writable: true
    },
    inherits: {
        value: require("util").inherits,
        configurable: false,
        enumerable: true,
        writable: true
    },
    settings: {
        value: require("object-settings"),
        configurable: false,
        enumerable: true,
        writable: true
    },
    validate: {
        value: require("object-validation").validate,
        configurable: false,
        enumerable: true,
        writable: true
    },
    emitter: {
        value: require("object-emitter"),
        configurable: false,
        enumerable: true,
        writable: true
    },
    request: {
        value: require("request"),
        configurable: false,
        enumerable: true,
        writable: true
    }
});