var process = require('child_process');

module.exports = function(command, dir, options, done) {
    var options = {};
    if (dir) options.cwd = dir;
    const ls = process.exec(command, options);

    var outs = [];
    var errs = [];

    ls.stdout.on('data', (data) => {
        outs.push(data);
        if (options.stdout) options.stdout(data);
    });

    ls.stderr.on('data', (data) => {
        errs.push(data);
        if (options.stderr) options.stderr(data);
    });

    ls.on('close', (code) => {
        done(code, outs, errs);
    });

}
