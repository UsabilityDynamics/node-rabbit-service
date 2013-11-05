#!/usr/bin/env node

module.main       = require( '../' );
module.package    = require( '../package.json' );
module.commander  = require( 'commander' );

module.commander
  .version( module.package.version )
  .option( '--pid', 'Specify a PID of an instance.' )
  .parse( process.argv );

// module.main.start( module.commander.args );