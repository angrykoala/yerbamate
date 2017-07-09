const processChild = require('child_process');

class Runner{
    static filterOutput(out) {
        return out.split('\n').filter(Boolean);
    }

    static run(command, dir, options, done) {
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

        let execOptions = {
            shell: true
        };

        let args = [];
        if (dir) {
            execOptions.cwd = dir;
        }
        if (options.args) {
            if (options.args.constructor === Array) {
                args = options.args;
            } else args = options.args.split(' ');
        }

        let arr = command.split(' ').concat(args);
        let proc;
        try {
            proc = processChild.spawn(arr.shift(), arr, execOptions);
        } catch (e) {
            done(1, [], [e]);
            return null;
        }

        let outs = '';
        let errs = '';

        proc.stdout.on('data', (data) => {
            outs += data;
            if (options.stdout) {
                options.stdout(data.toString());
            }
        });

        proc.stderr.on('data', (data) => {
            errs += data;
            if (options.stderr) {
                options.stderr(data.toString());
            }
        });

        proc.on('error', (err) => errs += err);

        proc.on('close', (code, signal) => {
            if (signal === 'SIGTERM' && code === null) {
                code = 143;
            }

            if (typeof done === 'function') {
                done(code, Runner.filterOutput(outs), Runner.filterOutput(errs));
            }
        });

        return proc;
    }
}

module.exports = Runner.run;
