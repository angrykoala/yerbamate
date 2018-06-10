"use strict";

const path = require('path');
const childProcess = require('child_process');
const untildify = require('untildify');

class Runner {

    static filterOutput(out) {
        return out.split('\n').filter(Boolean);
    }

    static processPath(dir) {
        dir = untildify(dir).trim();
        return path.resolve(dir);
    }

    static runProcess(command, dir, options, done) {
        const execOptions = {
            shell: true
        };
        let args = [];
        if (dir) execOptions.cwd = Runner.processPath(dir);

        if (options.args) {
            if (options.args.constructor === Array) {
                args = options.args;
            } else args = options.args.split(" ");
        }

        if (options.env) {
            execOptions.env = Object.assign(options.env, process.env);
        }

        const arr = command.split(" ").concat(args);
        let proc;
        try {
            proc = childProcess.spawn(arr.shift(), arr, execOptions);
        } catch (e) {
            done(1, [], [e]);
            return null;
        }

        let outs = "";
        let errs = "";

        proc.stdout.on('data', (data) => {
            outs += data;
            if (options.maxOutputSize) outs = outs.slice(-options.maxOutputSize);
            if (options.stdout) options.stdout(data.toString());
        });

        proc.stderr.on('data', (data) => {
            errs += data;
            if (options.maxOutputSize) errs = errs.slice(-options.maxOutputSize);
            if (options.stderr) options.stderr(data.toString());
        });

        proc.on('error', (err) => {
            errs += err;
        });

        proc.on('close', (code, signal) => {
            if (signal === "SIGTERM" && code === null) code = 143;
            if (done) done(code, Runner.filterOutput(outs), Runner.filterOutput(errs));
        });
        return proc;
    }

}
module.exports = (command, dir, options, done) => {
    if (!done && typeof options === 'function') {
        done = options;
        options = null;
    }
    if (!done && !options && typeof dir === 'function') {
        done = dir;
        dir = null;
        options = null;
    }
    if (!options && typeof dir === 'object') {
        options = dir;
        dir = null;
    }
    if (!options) options = {};

    return Runner.runProcess(command, dir, options, done);
};
