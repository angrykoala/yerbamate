var process = require('child_process');

module.exports = function(command, dir, options, done) {
    return new Promise(function(resolve, reject) {
        var execOptions = {};
        if (dir) execOptions.cwd = dir;
        if(options.args) command=command+" "+options.args;
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
    
            if (code === 0) {
                resolve(outs);
            } else {
                reject(errs);
            }
        });
    });
};
