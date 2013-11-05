/**
 * RabbitMQ Client Utility Methods
 *
 * @class Utility
 * @uses Abstract
 */
var Utility = require( 'abstract' ).utility;

/**
 * Extra Utility Methods
 *
 */
Object.defineProperties( module.exports = Utility, {
  inherits: {
    value: require( 'util' ).inherits,
    configurable: false,
    enumerable: true,
    writable: true
  },
  settings: {
    value: require( 'object-settings' ),
    configurable: false,
    enumerable: true,
    writable: true
  },
  validate: {
    value: require( 'object-validation' ),
    configurable: false,
    enumerable: true,
    writable: true
  },
  emitter: {
    value: require( 'object-emitter' ),
    configurable: false,
    enumerable: true,
    writable: true
  },
  request: {
    value: require( 'request' ),
    configurable: false,
    enumerable: true,
    writable: true
  }
});