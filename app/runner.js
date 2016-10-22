var process = require('child_process');

module.exports = function(command, dir, options, done) {

    var execOptions = {};
    if (dir) execOptions.cwd = dir;
    var proc = process.exec(command, execOptions);

    var outs = [];
    var errs = [];

    proc.stdout.on('data', function(data) {
        outs.push(data);
        if (options.stdout) options.stdout(data);
    });

    proc.stderr.on('data', function(data) {
        errs.push(data);
        if (options.stderr) options.stderr(data);
    });

    proc.on('close', function(code) {
        done(code, outs, errs);
    });
};
