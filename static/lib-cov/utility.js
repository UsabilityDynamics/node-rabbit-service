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
_$jscoverage_init(_$jscoverage, "lib/utility.js",[7,13,24,25,27,29,31]);
_$jscoverage_init(_$jscoverage_cond, "lib/utility.js",[]);
_$jscoverage["lib/utility.js"].source = ["/**"," * RabbitMQ Client Utility Methods"," *"," * @class Utility"," * @uses Abstract"," */","var Utility = require( 'abstract' ).utility;","","/**"," * Extra Utility Methods"," *"," */","Object.defineProperties( module.exports = Utility, {","  absolute_path: {","    /**","     * Use Parent Module's Path","     *","     * @param target","     * @param current","     * @returns {*|String}","     */","    value: function resolve( target, current ) {","","      var direname = require( 'path' ).dirname;","      var path = require( 'path' ).resolve( target, current || '.' );","","      current = current || direname( current || module.parent.filename ) || '.';","","      var resolved = require( 'path' ).resolve( target, current );","","      return resolved;","","    },","    configurable: false,","    enumerable: true,","    writable: true","  },","  spawn: {","    value: require( 'child_process' ).spawn,","    configurable: false,","    enumerable: true,","    writable: true","  },","  dirname: {","    value: require( 'path' ).dirname,","    configurable: false,","    enumerable: true,","    writable: true","  },","  pick: {","    value: require( 'lodash' ).pick,","    configurable: false,","    enumerable: true,","    writable: true","  },","  inherits: {","    value: require( 'util' ).inherits,","    configurable: false,","    enumerable: true,","    writable: true","  },","  settings: {","    value: require( 'object-settings' ),","    configurable: false,","    enumerable: true,","    writable: true","  },","  validate: {","    value: require( 'object-validation' ).validate,","    configurable: false,","    enumerable: true,","    writable: true","  },","  emitter: {","    value: require( 'object-emitter' ),","    configurable: false,","    enumerable: true,","    writable: true","  },","  request: {","    value: require( 'request' ),","    configurable: false,","    enumerable: true,","    writable: true","  }","});"];
_$jscoverage_done("lib/utility.js", 7);
var Utility = require("abstract").utility;

_$jscoverage_done("lib/utility.js", 13);
Object.defineProperties(module.exports = Utility, {
    absolute_path: {
        value: function resolve(target, current) {
            _$jscoverage_done("lib/utility.js", 24);
            var direname = require("path").dirname;
            _$jscoverage_done("lib/utility.js", 25);
            var path = require("path").resolve(target, current || ".");
            _$jscoverage_done("lib/utility.js", 27);
            current = current || direname(current || module.parent.filename) || ".";
            _$jscoverage_done("lib/utility.js", 29);
            var resolved = require("path").resolve(target, current);
            _$jscoverage_done("lib/utility.js", 31);
            return resolved;
        },
        configurable: false,
        enumerable: true,
        writable: true
    },
    spawn: {
        value: require("child_process").spawn,
        configurable: false,
        enumerable: true,
        writable: true
    },
    dirname: {
        value: require("path").dirname,
        configurable: false,
        enumerable: true,
        writable: true
    },
    pick: {
        value: require("lodash").pick,
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