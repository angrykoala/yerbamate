"use strict";

import path from 'path';
import childProcess, { ChildProcessWithoutNullStreams } from 'child_process';
import untildify from 'untildify';

type IOCallback = (value: string) => void

type RunnerOptions = {
    args: Array<string> | string, // TODO: fixme
    env: Record<string, string>,
    maxOutputSize?: number
    stdout?: IOCallback,
    stderr?: IOCallback
}

type DoneCallback = (code: number | null, out: string[], err: string[]) => void
type ProcessResult = ChildProcessWithoutNullStreams

class Runner {

    static filterOutput(out: any) {
        return out.split('\n').filter(Boolean);
    }

    static processPath(dir: any) {
        dir = untildify(dir).trim();
        return path.resolve(dir);
    }

    static runProcess(command: string, dir: string, options: RunnerOptions, done: DoneCallback): ProcessResult | null {
        const execOptions: any = {
            shell: true
        };
        let args: string[] = [];
        if (dir) execOptions.cwd = Runner.processPath(dir);

        if (options.args) {
            if (Array.isArray(options.args)) {
                args = options.args;
            } else args = options.args.split(" ");
        }

        if (options.env) {
            execOptions.env = Object.assign(options.env, process.env);
        }

        const arr = command.split(" ").concat(args);
        let proc: ChildProcessWithoutNullStreams;
        try {
            proc = childProcess.spawn(arr.shift() as string, arr, execOptions);
        } catch (e: unknown) { // TODO: fixme
            done(1, [], [e as string]);
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

        proc.on('close', (code: number | null, signal:  NodeJS.Signals | null) => {
            if (signal === "SIGTERM" && code === null) code = 143;
            if (done) done(code, Runner.filterOutput(outs), Runner.filterOutput(errs));
        });
        return proc;
    }
}




export function run(command: string, done: DoneCallback): ProcessResult | null ;
export function run(command: string, dir: any, options: Record<string, any> | undefined, done: DoneCallback): ProcessResult | null;
export function run(command: string, dir: any, done: DoneCallback): ProcessResult | null;
export function run(command: string, dir?: any, options?: Record<string, any> | DoneCallback, done?: DoneCallback): ProcessResult | null  {
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

    return Runner.runProcess(command, dir, options as RunnerOptions, done as DoneCallback);
};
