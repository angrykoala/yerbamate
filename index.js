// Yerbamate
// by @angrykoala
// The js testing library for command-line interfaces.

var runner = require('./app/runner');
var loader = require('./app/loader');


module.exports = {
    run: runner,
    loadPackage: loader,
    successCode: function(code) {
        return code === 0;
    }
};