// Yerbamate
// by @angrykoala
// The js testing library for command-line interfaces.

const kill = require('tree-kill');
const runner = require('./app/runner');
const loader = require('./app/loader');

class Main{
    static get run(){
        return runner;
    }

    static get loadPackage(){
        return loader;
    }

    static stop(proc,cb){
        kill(proc.pid,'SIGKILL', cb); //This sends SIGTERM
    }

    static successCode(code) {
        return code === 0;
    }
}

module.exports = Main;
