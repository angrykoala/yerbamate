"use strict";

import path from 'path';
import childProcess, { ChildProcessWithoutNullStreams } from 'child_process';
import untildify from 'untildify';

type IOCallback = (value: string) => void

export type RunSettings = {
    args?: Array<string> | string,
    env?: Record<string, string>,
    maxOutputSize?: number
    stdout?: IOCallback,
    stderr?: IOCallback
}

type ExecSettings = { shell: boolean, cwd?: string, env: Record<string, string> }

type DoneCallback = (code: number | null, out: string, err: string) => void
type ProcessResult = ChildProcessWithoutNullStreams

export function run(command: string, done: DoneCallback): ProcessResult | null;
export function run(command: string, path: string, done: DoneCallback): ProcessResult | null;
export function run(command: string, settings: RunSettings, done: DoneCallback): ProcessResult | null;
export function run(command: string, path: string, settings: RunSettings, done: DoneCallback): ProcessResult | null;
export function run(command: string, pathOrSettingsOrCallback: string | DoneCallback | RunSettings, settingsOrCallback?: RunSettings | DoneCallback, done?: DoneCallback): ProcessResult | null {
    const executionPath = typeof pathOrSettingsOrCallback === "string" ? pathOrSettingsOrCallback : undefined;
    let executionCallback: DoneCallback | undefined = done
    let executionSettings: RunSettings = {}


    if (settingsOrCallback && typeof settingsOrCallback !== 'function') {
        executionSettings = settingsOrCallback;
    } else if (typeof pathOrSettingsOrCallback !== "string" && typeof pathOrSettingsOrCallback !== 'function') {
        executionSettings = pathOrSettingsOrCallback
    }
    if (!done && typeof settingsOrCallback === 'function') {
        executionCallback = settingsOrCallback
    } else if (!settingsOrCallback && typeof pathOrSettingsOrCallback === 'function') {
        executionCallback = pathOrSettingsOrCallback
    }

    if (!executionCallback) {
        throw new Error("Invalid done callback for run.");
    }

    return runProcess(command, executionPath, executionSettings, executionCallback);
};

function runProcess(rawCommand: string, path: string | undefined, settings: RunSettings, done: DoneCallback): ProcessResult | null {
    const execSettings: ExecSettings = {
        shell: true,
        env: Object.assign(process.env, settings.env || {}),
        cwd: path ? processPath(path) : undefined
    };

    const { command, args } = prepareCommandAndArgs(rawCommand, settings.args)
    let proc: ChildProcessWithoutNullStreams;
    try {
        proc = childProcess.spawn(command, args, execSettings);
    } catch (e: unknown) {
        let errorMessage = `${e}`
        if (e instanceof Error) {
            errorMessage = e.message
        }

        done(1, "", errorMessage);
        return null;
    }

    setProcessHooks(proc, settings, done);
    return proc;
}

function setProcessHooks(proc: ChildProcessWithoutNullStreams, settings: RunSettings, done: DoneCallback) {
    let outs = "";
    let errs = "";

    proc.stdout.on('data', (data: string) => {
        outs += data;
        if (settings.maxOutputSize) outs = outs.slice(-settings.maxOutputSize);
        if (settings.stdout) settings.stdout(data.toString());
    });

    proc.stderr.on('data', (data: string) => {
        errs += data;
        if (settings.maxOutputSize) errs = errs.slice(-settings.maxOutputSize);
        if (settings.stderr) settings.stderr(data.toString());
    });

    proc.on('error', (err: string) => {
        errs += err;
    });

    proc.on('close', (code: number | null, signal: NodeJS.Signals | null) => {
        if (signal === "SIGTERM" && code === null) code = 143;
        done(code, outs, errs);
    });
}

function prepareCommandAndArgs(commandStr: string, extraArgs: string | Array<string> | undefined): { command: string, args: Array<string> } {
    let settingsArgs: string[] = [];

    if (extraArgs) {
        if (Array.isArray(extraArgs)) {
            settingsArgs = extraArgs
        } else {
            settingsArgs = extraArgs.split(" ");
        }
    }

    const argTokens = commandStr.split(" ").concat(settingsArgs)
    const mainCommand = argTokens.shift() as string;

    return {
        command: mainCommand,
        args: argTokens
    }
}

function processPath(dir: string): string {
    dir = untildify(dir).trim();
    return path.resolve(dir);
}
