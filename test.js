'use strict'
var test = require('tape')
var sloccount = require('./')
var fs = require('fs')

test('can count get lines of the index.js file (without comments)', function (t) {
  t.plan(4)
  sloccount({src: './index.js', reportPath: 'stats/report.sc', comments: false, verbose: false})

  var contents = fs.readFileSync('stats/report.sc', 'utf-8')
  t.equal(contents.indexOf('Categorizing files.') !== -1, true)
  t.equal(contents.indexOf('Computing results.') !== -1, true)
  t.equal(contents.indexOf('57	js') !== -1, true)
  t.equal(contents.indexOf('sloccount/index.js') !== -1, true)
})

test('can count get lines of the index.js file (with comments)', function (t) {
  t.plan(6)
  sloccount({src: './index.js', reportPath: 'stats/report.sc', comments: true, verbose: false})

  var contents = fs.readFileSync('stats/report.sc', 'utf-8')
  t.equal(contents.indexOf('Categorizing files.') !== -1, true)
  t.equal(contents.indexOf('Computing results.') !== -1, true)
  t.equal(contents.indexOf('57	js') !== -1, true)
  t.equal(contents.indexOf('sloccount/index.js') !== -1, true)
  t.equal(contents.indexOf('14	jscm') !== -1, true)
  t.equal(contents.indexOf('sloccount/index.js.cm') !== -1, true)
})

test('throws if no source directory is given', function (t) {
  t.plan(1)
  t.throws(function () {
    sloccount()
  }, Error)
})
