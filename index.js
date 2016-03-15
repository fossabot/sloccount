/*
 * grunt-sloccount
 * https://github.com/asciidisco/sloccount
 *
 * Copyright (c) 2016 Sebastian Golasch
 * Licensed under the MIT license.
 */

'use strict'

var path = require('path')
var fs = require('fs')
var sloc = require('sloc')
var glob = require('glob')
var mkdirp = require('mkdirp')

module.exports = function (options) {
  options = options || {}
  // check for src directories
  if (!options.src) {
    throw Error('Please configure one or more src directories!')
  }

  var filesToMatch = glob.sync(options.src)
  var folders = []
  // generate flat list of folders
  var map = {}
  filesToMatch.forEach(function (currentValue) {
    var cv = path.dirname(currentValue)
    if (!map[cv]) {
      map[cv] = true
      folders.push(cv)
    }
  })

  // check if path fpr report file is given & exists
  if (options.reportPath) mkdirp.sync(path.dirname(options.reportPath))

  // clear file
  if (options.reportPath) fs.writeFileSync(options.reportPath, '')

  // write (dynamic) intro for file
  folders.forEach(function (folder) {
    if (folder === '.') folder = process.cwd()
    var startLine = 'Creating filelist for ' + folder
    if (options.reportPath) fs.appendFileSync(options.reportPath, startLine + '\n', 'utf8')
    if (!options.reportPath || options.verbose) console.log(startLine)
  })

  // write (static) intro for file
  var sndTrail = 'Categorizing files.'
  var thrdTrail = 'Computing results.'
  var fourthTrail = '\n'
  if (options.reportPath) fs.appendFileSync(options.reportPath, sndTrail + '\n', 'utf8')
  if (options.reportPath) fs.appendFileSync(options.reportPath, thrdTrail + '\n', 'utf8')
  if (options.reportPath) fs.appendFileSync(options.reportPath, fourthTrail + '\n', 'utf8')
  if (!options.reportPath || options.verbose) console.log(sndTrail)
  if (!options.reportPath || options.verbose) console.log(thrdTrail)
  if (!options.reportPath || options.verbose) console.log(fourthTrail)

  var fileContents, stats, extname
  filesToMatch.forEach(function (file) {
    extname = path.extname(file).replace('.', '')
    fileContents = fs.readFileSync(file, 'utf8')
    if (extname === 'js' || extname === 'css' || extname === 'scss' || extname === 'html') {
      stats = sloc(fileContents, extname)
      var fileStats = stats.source + '\t' + extname + '\t' + (path.dirname(file) === '.' ? process.cwd() : path.dirname(file)) + '\t' + fs.realpathSync(file)
      if (options.reportPath) fs.appendFileSync(options.reportPath, fileStats + '\n', 'utf8')
      if (!options.reportPath || options.verbose) console.log(fileStats)

      // check if comments should be tracked seperatly
      if (options.comments !== false) {
        var commentStats = stats.comment + '\t' + extname + 'cm' + '\t' + (path.dirname(file) === '.' ? process.cwd() : path.dirname(file)) + '\t' + fs.realpathSync(file) + '.cm'
        if (options.reportPath) fs.appendFileSync(options.reportPath, commentStats + '\n', 'utf8')
        if (!options.reportPath || options.verbose) console.log(commentStats)
      }
    }
  })

  if (options.reportPath && options.verbose) console.log('Report File: ' + options.reportPath + ' written!')
  return true
}
