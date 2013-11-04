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
_$jscoverage_init(_$jscoverage, "lib/utility.js",[10]);
_$jscoverage_init(_$jscoverage_cond, "lib/utility.js",[]);
_$jscoverage["lib/utility.js"].source = ["/**"," * RabbitMQ Client Utility Methods"," *"," * @constructor"," */","function Utility() {","","}","","Object.defineProperties( module.exports = Utility, {","  method: {","    /**","     * Some Utility Method","     *","     */","    value: function method() {","","    },","    enumerable: true,","    configurable: true,","    writable: true","  }","});"];
function Utility() {}

_$jscoverage_done("lib/utility.js", 10);
Object.defineProperties(module.exports = Utility, {
    method: {
        value: function method() {},
        enumerable: true,
        configurable: true,
        writable: true
    }
});