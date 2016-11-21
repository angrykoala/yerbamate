var process = require('child_process');

function filterOutput(out) {
    return out.split('\n').filter(Boolean);
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

    var execOptions = {};
    if (dir) execOptions.cwd = dir;
    if (options.args) {
        var args;
        if (options.args.constructor === Array) {
            args = options.args.join(" ");
        } else args = options.args;
        command = command + " " + args;
    }
    var proc = process.exec(command, execOptions);

    var outs = "";
    var errs = "";

    proc.stdout.on('data', function(data) {
        outs += data;
        if (options.stdout) options.stdout(data);
    });

    proc.stderr.on('data', function(data) {
        errs += data;
        if (options.stderr) options.stderr(data);
    });

    proc.on('close', function(code,signal) {
        if(signal==="SIGTERM" && code===null) code=143;
        if (done) done(code, filterOutput(outs), filterOutput(errs));
    });
    return proc;
};
