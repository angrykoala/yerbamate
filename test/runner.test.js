var assert = require('chai').assert;
var path = require('path');

var run = require('../app/runner.js');

var testDir = path.join(__dirname, "config");
var testScript = "example.js";




describe("Loader", function() {
    function checkDefaultOutput(code, outs, errs) {
        assert.ok(outs);
        assert.ok(errs);
        assert.strictEqual(code, 0);
        assert.lengthOf(outs, 2);
        assert.lengthOf(errs, 1);
        assert.strictEqual(outs[0], "Example js running\n");
        assert.strictEqual(errs[0], "Warning example\n");
    }
    it("Execute script", function(done) {
        run("node " + path.join(testDir, testScript), "", {}, function(code, outs, errs) {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "2\n");
            done();
        });
    });
    it("Different directory", function(done) {
        run("node " + testScript, testDir, {}, function(code, outs, errs) {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "2\n");
            done();
        });
    });
    it("Execute command with args", function(done) {
        run("node " + testScript, testDir, {
            args: "myargument1 myargument2"
        }, function(code, outs, errs) {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "4\n");
            done();
        });
    });
    it("Script returning error code", function(done) {
        run("node " + testScript, testDir, {
            args: "-error"
        }, function(code, outs, errs) {
            assert.ok(outs);
            assert.ok(errs);
            assert.strictEqual(code, 1);
            assert.lengthOf(outs, 2);
            assert.lengthOf(errs, 2);
            assert.strictEqual(outs[0], "Example js running\n");
            assert.strictEqual(errs[0], "Warning example\n");
            assert.strictEqual(outs[1], "3\n");
            done();
        });
    });
    it("Invalid command", function(done) {
        run(testScript, testDir, {}, function(code, outs, errs) {
            assert.notEqual(code, 0);
            assert.lengthOf(outs, 0);
            assert.lengthOf(errs, 1);
            done();
        });
    });
    it("stout and stderr hooks", function(done) {
        var outTest = [];
        var errTest = [];
        var onOut = function(data) {
            outTest.push(data);
        };
        var onErr = function(data) {
            errTest.push(data);
        };

        run("node " + testScript, testDir, {
            stdout: onOut,
            stderr: onErr
        }, function(code, outs, errs) {
            checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "2\n");
            checkDefaultOutput(code, outTest, errTest);
            done();
        });
    });
});
