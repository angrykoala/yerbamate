// Yerbamate
// by @angrykoala
// The js testing library for command-line interfaces.

import kill from 'tree-kill';

import { loader } from './app/loader';
import { run } from './app/runner';

export default {
    run,
    loadPackage: loader,
    stop: (proc: any, cb?: any) => kill(proc.pid, 'SIGKILL', cb),
    successCode: (code?: any) => code === 0
};
