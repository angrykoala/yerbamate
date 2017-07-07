var process = require('child_process');
var untildify = require('untildify');


var path = require('path');
var os = require('os');

function filterOutput(out) {
    return out.split('\n').filter(Boolean);
}

function processPath(dir) {
    dir = untildify(dir).trim();
    return path.resolve(dir);
}


module.exports = function(command, dir, options, done) {
    if (!done && typeof options === 'function') {
        done = options;
        options = {};
    }
    if (!done && !options && typeof dir === 'function') {
        done = dir;
        dir = null;
        options = {};
    }
    if (!options) options = {};

    var execOptions = {
        shell: true
    };
    var args = [];
    if (dir) execOptions.cwd = processPath(dir);

    if (options.args) {
        if (options.args.constructor === Array) {
            args = options.args;
        } else args = options.args.split(" ");
    }

    var arr = command.split(" ").concat(args);
    var proc;
    try {
        proc = process.spawn(arr.shift(), arr, execOptions);
    } catch (e) {
        done(1, [], [e]);
        return null;
    }

    var outs = "";
    var errs = "";

    proc.stdout.on('data', function(data) {
        outs += data;
        if (options.stdout) options.stdout(data.toString());
    });

    proc.stderr.on('data', function(data) {
        errs += data;
        if (options.stderr) options.stderr(data.toString());
    });

    proc.on('error', function(err) {
        errs += err;
    });

    proc.on('close', function(code, signal) {
        if (signal === "SIGTERM" && code === null) code = 143;
        if (done) done(code, filterOutput(outs), filterOutput(errs));
    });
    return proc;
};
