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
_$jscoverage_init(_$jscoverage, "lib/rabbitmq-client.js",[9,16,36]);
_$jscoverage_init(_$jscoverage_cond, "lib/rabbitmq-client.js",[]);
_$jscoverage["lib/rabbitmq-client.js"].source = ["/**"," * RabbitMQ"," *"," * @class RabbitMQ"," * @constructor"," * @version 3.2.0"," */","function RabbitMQ() {","  return 'awesome';","}","","/**"," * Instance Properties"," *"," */","Object.defineProperties( RabbitMQ.prototype, {","  some_action: {","    /**","     * Some Actions","     *","     * @for RabbitMQ","     */","    value: function some_action() {","","    },","    enumerable: true,","    configurable: true,","    writable: true","  }","});","","/**"," * Constructor Properties"," *"," */","Object.defineProperties( module.exports = RabbitMQ, {","  create: {","    /**","     * Create Instance","     *","     * @for RabbitMQ","     */","    value: function create() {","","    },","    enumerable: true,","    configurable: true,","    writable: true","  }","});"];
function RabbitMQ() {
    _$jscoverage_done("lib/rabbitmq-client.js", 9);
    return "awesome";
}

_$jscoverage_done("lib/rabbitmq-client.js", 16);
Object.defineProperties(RabbitMQ.prototype, {
    some_action: {
        value: function some_action() {},
        enumerable: true,
        configurable: true,
        writable: true
    }
});

_$jscoverage_done("lib/rabbitmq-client.js", 36);
Object.defineProperties(module.exports = RabbitMQ, {
    create: {
        value: function create() {},
        enumerable: true,
        configurable: true,
        writable: true
    }
});