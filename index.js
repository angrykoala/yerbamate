"use strict";

// Yerbamate
// by @angrykoala
// The js testing library for command-line interfaces.

const kill = require('tree-kill');
const runner = require('./app/runner');
const loader = require('./app/loader');

module.exports = {
    run: runner,
    loadPackage: loader,
    stop: (proc, cb) => kill(proc.pid, 'SIGKILL', cb), //This sends SIGTERM
    successCode: (code) => code === 0
};
