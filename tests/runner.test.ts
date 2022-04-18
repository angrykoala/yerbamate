import path from 'path';
import { ChildProcess } from 'child_process';
import { assert } from 'chai';

import config from './config/config';
import * as yerbamate from '../main';

const { run, stop } = yerbamate;

const testScript = config.testScript;
const testDir = path.join(__dirname, "config");

describe("Runner", () => {
    const checkDefaultOutput = config.checkDefaultOutput;

    it("Execute script", (done) => {
        run("node " + path.join(testDir, testScript), (code, outs, errs) => {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs.split("\n")[1], "2");
            done();
        });
    });

    it("Different directory", (done) => {
        run("node " + testScript, testDir, (code, outs, errs) => {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs.split("\n")[1], "2");
            done();
        });
    });

    it("Execute command with args", (done) => {
        run("node " + testScript, testDir, {
            args: "myargument1 myargument2"
        }, function(code, outs, errs) {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs.split("\n")[1], "4");
            done();
        });
    });

    it("Script returning error code", (done) => {
        run("node " + testScript, testDir, {
            args: "-error"
        }, function(code, outs, errs) {
            assert.ok(outs);
            assert.ok(errs);
            assert.strictEqual(code, 1);
            assert.strictEqual(outs, "Example js running\n3\n");
            assert.strictEqual(errs.split("\n")[0], "Warning example");
            done();
        });
    });

    it("Invalid command", (done) => {
        run(testScript, testDir, (code, outs, errs) => {
            assert.notEqual(code, 0);
            assert.strictEqual(outs, "");
            assert.ok(errs);
            done();
        });
    });

    it("Stdout and stderr hooks", (done) => {
        let outTest = "";
        let errTest = "";
        const onOut = (data: any) => {
            assert.typeOf(data, "string");
            outTest += data;
        };
        const onErr = (data: any) => {
            assert.typeOf(data, "string");
            errTest += data;
        };

        run("node " + testScript, testDir, {
            stdout: onOut,
            stderr: onErr
        }, function(code, outs, errs) {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs.split("\n")[1], "2");
            checkDefaultOutput(code, outTest, errTest);
            done();
        });
    });

    describe("stop", () => {
        it("Stop process", (done) => {
            const proc = run("node", (code) => {
                assert.notEqual(code, 0);
                done();
            }) as ChildProcess;
            assert.ok(proc);
            stop(proc);
        });

        it("Stop process callback", (done) => {
            const proc = run("node", () => { }) as ChildProcess;
            assert.ok(proc);
            stop(proc, function(err: any) {
                assert.notOk(err);
                done();
            });
        });

        it("Throws if stop is called without pid", () => {
            assert.throws(() => {
                stop(undefined as any)
            })
            assert.throws(() => {
                stop({ pid: undefined } as any)
            })
            assert.throws(() => {
                stop({ pid: null } as any)
            })
        })
    })

    it("Array arguments", (done) => {
        run("node " + testScript, testDir, {
            args: ["myargument1", "myargument2"]
        }, function(code, outs, errs) {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs.split("\n")[1], "4");
            done();
        });
    });

    it("Execute envs defined in command", (done) => {
        run("testenv=dontpanic node print_env.js", testDir, (code, outs, errs) => {
            assert.strictEqual(code, 0);
            assert.strictEqual(errs, "");
            assert.strictEqual(outs, "dontpanic\n");
            done();
        });
    });

    it("Execute envs defined in options", (done) => {
        run("node print_env.js", testDir, {
            env: {
                testenv: "dontpanic"
            }
        }, (code, outs, errs) => {
            assert.strictEqual(code, 0);
            assert.lengthOf(errs, 0);
            assert.strictEqual(outs, "dontpanic\n");
            done();
        });
    });

    it("Execute script without dir argument and options", (done) => {
        run("node " + path.join(testDir, testScript), {
            args: ["myargument1", "myargument2"]
        }, (code, outs, errs) => {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs.split("\n")[1], "4");
            done();
        });
    });

    it("Execute script with max output", (done) => {
        run("node " + path.join(testDir, testScript), {
            maxOutputSize: 10
        }, (_code, outs, errs) => {
            assert.strictEqual(outs, "running\n2\n");
            assert.strictEqual(errs, "g example\n");
            done();
        });
    });

    it("Throws if callback is not provided", ()=>{
        assert.throws(()=>{
            run("node "+ path.join(testDir, testScript), undefined as any);
        })
    })
});
