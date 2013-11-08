/**
 * Rabbit Service utilities
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
  absolute_path: {
    /**
     * Use Parent Module's Path
     *
     * @param target
     * @param current
     * @returns {*|String}
     */
    value: function resolve( target, current ) {

      var direname = require( 'path' ).dirname;
      var path = require( 'path' ).resolve( target, current || '.' );

      current = current || direname( current || module.parent.filename ) || '.';

      var resolved = require( 'path' ).resolve( target, current );

      return resolved;

    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  trim: {
    value: function( string ) {

      if( Buffer === typeof string ) {
        string = string.toString();
      }

      return require( 'string' )( string ).trim();

    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  spawn: {
    value: require( 'child_process' ).spawn,
    configurable: false,
    enumerable: true,
    writable: true
  },
  dirname: {
    value: require( 'path' ).dirname,
    configurable: false,
    enumerable: true,
    writable: true
  },
  pick: {
    value: require( 'lodash' ).pick,
    configurable: false,
    enumerable: true,
    writable: true
  },
  omit: {
    value: require( 'lodash' ).omit,
    configurable: false,
    enumerable: true,
    writable: true
  },
  inherits: {
    value: require( 'util' ).inherits,
    configurable: false,
    enumerable: true,
    writable: true
  },
  settings: {
    value: require( 'object-settings' ).mixin,
    configurable: false,
    enumerable: true,
    writable: true
  },
  validate: {
    value: require( 'object-validation' ).validate,
    configurable: false,
    enumerable: true,
    writable: true
  },
  emitter: {
    value: require( 'object-emitter' ).mixin,
    configurable: false,
    enumerable: true,
    writable: true
  },
  url_parse: {
    value: require( 'url' ).parse,
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