'use strict';

var util = require('util');
var chalk = require('chalk');
global.f = function(obj) {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
};
global.d = function() {
  var args = Array.prototype.slice.call(arguments);
  var time = new Date().toISOString();
  console.log(chalk.white.bgRed(time) + ' - ' + chalk.red('break') + ': ' + util.inspect.call(null, args.length === 1 ? args[0] : args, false, 10, true));
};
global.dd = function() {
  global.d.apply(null, arguments);
  var stack = new Error().stack.split('\n');
  stack.splice(1, 1);
  util.log(stack.join('\n'));
  process.exit(1);
};
global.gdebug = require('gulp-debug');
process.env.DEBUG = 'global';
global.debug = require('debug')('global');

var bunyan = require('bunyan');
var chalk = require('chalk');
var through2 = require('through2');
exports.log = bunyan.createLogger({name: 'app', streams: [{
  level: 'trace',
  stream: through2(function(chunk, enc, callback) {
    var obj = JSON.parse(chunk.toString('utf8'));
    var str = chalk.gray(obj.time);
    str += ' - ';
    if(obj.level === bunyan.TRACE) str += chalk.gray('trace');
    else if(obj.level === bunyan.DEBUG) str += chalk.cyan('debug');
    else if(obj.level === bunyan.INFO) str += chalk.green(' info');
    else if(obj.level === bunyan.WARN) str += chalk.yellow(' warn');
    else if(obj.level === bunyan.ERROR) str += chalk.bold.red('error');
    else if(obj.level === bunyan.FATAL) str += chalk.white.bgRed.bold('fatal');
    str += ': ';
    str += chalk.underline(obj.name);
    str += ' - ';
    str += obj.level === bunyan.FATAL ? chalk.white.bgRed.bold(obj.msg) : obj.msg;
    console.log(str);
    this.push(chunk);
    callback();
  }),
}]});
