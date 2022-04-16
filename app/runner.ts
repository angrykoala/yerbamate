"use strict";

import path from 'path';
import childProcess, { ChildProcess } from 'child_process';
import untildify from 'untildify';

class Runner {

    static filterOutput(out: any) {
        return out.split('\n').filter(Boolean);
    }

    static processPath(dir: any) {
        dir = untildify(dir).trim();
        return path.resolve(dir);
    }

    static runProcess(command: any, dir: any, options: any, done: any) {
        const execOptions: any = {
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

        proc.stdout.on('data', (data: any) => {
            outs += data;
            if (options.maxOutputSize) outs = outs.slice(-options.maxOutputSize);
            if (options.stdout) options.stdout(data.toString());
        });

        proc.stderr.on('data', (data: any) => {
            errs += data;
            if (options.maxOutputSize) errs = errs.slice(-options.maxOutputSize);
            if (options.stderr) options.stderr(data.toString());
        });

        proc.on('error', (err: any) => {
            errs += err;
        });

        proc.on('close', (code: any, signal: any) => {
            if (signal === "SIGTERM" && code === null) code = 143;
            if (done) done(code, Runner.filterOutput(outs), Runner.filterOutput(errs));
        });
        return proc;
    }
}


type DoneCallback = (code: number, out: string[], err: string[]) => void


export function run(command: string, done: DoneCallback): ChildProcess | null;
export function run(command: any, dir: any, options: Record<string, any> | undefined, done: DoneCallback): ChildProcess;
export function run(command: any, dir: any, done: DoneCallback): ChildProcess;
export function run(command: any, dir?: any, options?: Record<string, any> | DoneCallback, done?: DoneCallback): ChildProcess | null {
    if (!done && typeof options === 'function') {
        done = options as any;
        options = undefined;
    }
    if (!done && !options && typeof dir === 'function') {
        done = dir;
        dir = undefined;
        options = undefined;
    }
    if (!options && typeof dir === 'object') {
        options = dir;
        dir = undefined;
    }
    if (!options) options = {};

    return Runner.runProcess(command, dir, options, done);
};
