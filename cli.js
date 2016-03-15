#!/usr/bin/env node
'use strict'
var meow = require('meow')
var sloccount = require('./')

var cli = meow('\n' +
  'Usage\n' +
  '  $ sloccount <src> <reportPath>\n' +
  '\n' +
  'Options\n' +
  '  -c, --comments  Exclude comments\n' +
  '  -v, --verbose  Verbose output\n' +
  '\n' +
'    Examples\n' +
'      $ sloccount *.js report.sc --comments\n' +
'', {
  alias: {
    c: 'comments',
    v: 'verbose'
  }
})

sloccount({src: cli.input[0], reportPath: cli.input[1], comments: !!cli.flags.c, verbose: !!cli.flags.v})
