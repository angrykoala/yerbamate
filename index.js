"use strict";

// Yerbamate
// by @angrykoala
// The js testing library for command-line interfaces.

const runner = require('./app/runner');
const loader = require('./app/loader');

const kill = require('tree-kill');

module.exports = {
    run: runner,
    stop: (proc, cb) => {
        kill(proc.pid, 'SIGKILL', cb); //This sends SIGTERM
    },
    loadPackage: loader,
    successCode: (code) => {
        return code === 0;
    }
};
