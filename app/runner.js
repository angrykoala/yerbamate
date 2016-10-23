var process = require('child_process');

function filterOutput(out) {
    return out.split('\n').filter(Boolean);
}

module.exports = function(command, dir, options, done) {
    var execOptions = {};
    if (dir) execOptions.cwd = dir;
    if (options.args) command = command + " " + options.args;
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

    proc.on('close', function(code) {
        if (done) done(code, filterOutput(outs), filterOutput(errs));
    });
};
