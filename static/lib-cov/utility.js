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
_$jscoverage_init(_$jscoverage, "lib/utility.js",[7,13,24,25,27,29,31,41,42,45]);
_$jscoverage_init(_$jscoverage_cond, "lib/utility.js",[41]);
_$jscoverage["lib/utility.js"].source = ["/**"," * Rabbit Service utilities"," *"," * @class Utility"," * @uses Abstract"," */","var Utility = require( 'abstract' ).utility;","","/**"," * Extra Utility Methods"," *"," */","Object.defineProperties( module.exports = Utility, {","  absolute_path: {","    /**","     * Use Parent Module's Path","     *","     * @param target","     * @param current","     * @returns {*|String}","     */","    value: function resolve( target, current ) {","","      var direname = require( 'path' ).dirname;","      var path = require( 'path' ).resolve( target, current || '.' );","","      current = current || direname( current || module.parent.filename ) || '.';","","      var resolved = require( 'path' ).resolve( target, current );","","      return resolved;","","    },","    configurable: false,","    enumerable: true,","    writable: true","  },","  trim: {","    value: function( string ) {","","      if( Buffer === typeof string ) {","        string = string.toString();","      }","","      return require( 'string' )( string ).trim();","","    },","    configurable: false,","    enumerable: true,","    writable: true","  },","  spawn: {","    value: require( 'child_process' ).spawn,","    configurable: false,","    enumerable: true,","    writable: true","  },","  dirname: {","    value: require( 'path' ).dirname,","    configurable: false,","    enumerable: true,","    writable: true","  },","  pick: {","    value: require( 'lodash' ).pick,","    configurable: false,","    enumerable: true,","    writable: true","  },","  omit: {","    value: require( 'lodash' ).omit,","    configurable: false,","    enumerable: true,","    writable: true","  },","  inherits: {","    value: require( 'util' ).inherits,","    configurable: false,","    enumerable: true,","    writable: true","  },","  settings: {","    value: require( 'object-settings' ).mixin,","    configurable: false,","    enumerable: true,","    writable: true","  },","  validate: {","    value: require( 'object-validation' ).validate,","    configurable: false,","    enumerable: true,","    writable: true","  },","  emitter: {","    value: require( 'object-emitter' ).mixin,","    configurable: false,","    enumerable: true,","    writable: true","  },","  url_parse: {","    value: require( 'url' ).parse,","    configurable: false,","    enumerable: true,","    writable: true","  },","  request: {","    value: require( 'request' ),","    configurable: false,","    enumerable: true,","    writable: true","  }","});"];
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
    trim: {
        value: function(string) {
            _$jscoverage_done("lib/utility.js", 41);
            if (_$jscoverage_done("lib/utility.js", 41, Buffer === typeof string)) {
                _$jscoverage_done("lib/utility.js", 42);
                string = string.toString();
            }
            _$jscoverage_done("lib/utility.js", 45);
            return require("string")(string).trim();
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
    omit: {
        value: require("lodash").omit,
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
        value: require("object-settings").mixin,
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
        value: require("object-emitter").mixin,
        configurable: false,
        enumerable: true,
        writable: true
    },
    url_parse: {
        value: require("url").parse,
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