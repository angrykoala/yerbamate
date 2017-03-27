// Yerbamate
// by @angrykoala
// The js testing library for command-line interfaces.

var runner = require('./app/runner');
var loader = require('./app/loader');

var kill = require('tree-kill');

module.exports = {
    run: runner,
    stop: function(proc, cb) {
        kill(proc.pid,'SIGKILL', cb); //This sends SIGTERM
    },
    loadPackage: loader,
    successCode: function(code) {
        return code === 0;
    }
};
