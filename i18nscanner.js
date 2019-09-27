var scanner = require('i18next-scanner');
var vfs = require('vinyl-fs');
var sort = require('gulp-sort');
var options = require('./config/i18next-scanner.config.js').options

console.log(options)

vfs.src(['client/src/**/*.{js,jsx}'])
  .pipe(sort()) // Sort files in stream by path
  .pipe(scanner(options))
  .pipe(vfs.dest('.'));


