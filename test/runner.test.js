"use strict";

const assert = require('chai').assert;
const path = require('path');

const run = require('../app/runner.js');
const stop = require('../index').stop;

const testDir = path.join(__dirname, "config");

const config = require('./config/config');
const testScript = config.testScript;


describe("Runner", () => {
    const checkDefaultOutput = config.checkDefaultOutput;

    it("Execute script", (done) => {
        run("node " + path.join(testDir, testScript), (code, outs, errs) => {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "2");
            done();
        });
    });
    it("Different directory", (done) => {
        run("node " + testScript, testDir, (code, outs, errs) => {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "2");
            done();
        });
    });
    it("Execute command with args", (done) => {
        run("node " + testScript, testDir, {
            args: "myargument1 myargument2"
        }, function(code, outs, errs) {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "4");
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
            assert.lengthOf(outs, 2);
            assert.isAtLeast(errs.length, 2);
            assert.strictEqual(outs[0], "Example js running");
            assert.strictEqual(errs[0], "Warning example");
            assert.strictEqual(outs[1], "3");
            done();
        });
    });
    it("Invalid command", (done) => {
        run(testScript, testDir, (code, outs, errs) => {
            assert.notEqual(code, 0);
            assert.lengthOf(outs, 0);
            assert.lengthOf(errs, 1);
            done();
        });

    });

    it("Stout and stderr hooks", (done) => {
        let outTest = "";
        let errTest = "";
        const onOut = (data) => {
            assert.typeOf(data, "string");
            outTest += data;
        };
        const onErr = (data) => {
            assert.typeOf(data, "string");
            errTest += data;
        };

        run("node " + testScript, testDir, {
            stdout: onOut,
            stderr: onErr
        }, function(code, outs, errs) {
            outTest = outTest.split('\n').filter(Boolean);
            errTest = errTest.split('\n').filter(Boolean);
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "2");
            checkDefaultOutput(code, outTest, errTest);
            done();
        });
    });

    it("Stop process", (done) => {
        const proc = run("node", (code) => {
            assert.notEqual(code, 0);
            done();
        });
        assert.ok(proc);
        stop(proc);
    });

    it("Stop process callback", (done) => {
        const proc = run("node", function() {});
        assert.ok(proc);
        stop(proc, function(err) {
            assert.notOk(err);
            done();
        });
    });

    it("Array arguments", (done) => {
        run("node " + testScript, testDir, {
            args: ["myargument1", "myargument2"]
        }, function(code, outs, errs) {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "4");
            done();
        });
    });

    it("Execute script with undefined options and arguments", (done) => {
        run("node " + path.join(testDir, testScript), undefined, undefined, (code, outs, errs) => {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "2");
            done();
        });
    });

    it("Execute envs defined in command", (done) => {
        run("testenv=dontpanic node print_env.js", testDir, (code, outs, errs) => {
            assert.ok(outs);
            assert.ok(errs);
            assert.strictEqual(code, 0);
            assert.lengthOf(outs, 1);
            assert.lengthOf(errs, 0);
            assert.strictEqual(outs[0], "dontpanic");
            done();
        });
    });

    it("Execute envs defined in options", (done) => {
        run("node print_env.js", testDir, {
            env: {
                testenv: "dontpanic"
            }
        }, function(code, outs, errs) {
            assert.ok(outs);
            assert.ok(errs);
            assert.strictEqual(code, 0);
            assert.lengthOf(outs, 1);
            assert.lengthOf(errs, 0);
            assert.strictEqual(outs[0], "dontpanic");
            done();
        });
    });

    it("Execute script without dir argument and options", (done) => {
        run("node " + path.join(testDir, testScript), {
            args: ["myargument1", "myargument2"]
        }, function(code, outs, errs) {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "4");
            done();
        });
    });
});
