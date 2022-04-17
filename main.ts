// Yerbamate
// by @angrykoala
// The JavaScript library for command-line testing.

import kill from 'tree-kill';
import { ChildProcess } from 'child_process';

type StopCallback = (error?: Error) => void;

export { run } from './app/runner';
export { loadPackage } from './app/loader';

export function stop(proc: ChildProcess, cb?: StopCallback): void {
    if (proc.pid === undefined || proc.pid === null) throw new Error("[stop] Process pid is not defined");
    kill(proc.pid, 'SIGKILL', cb);
}

export function isSuccessCode(code?: unknown): boolean {
    return code === 0;
}
