"use strict";

const assert = require('chai').assert;

const yerbamate = require('../index');
const config = require('./config/config');

describe("Yerbamate index", function() {
    it("Main Functions", function() {
        assert.ok(yerbamate);
        assert.ok(yerbamate.run);
        assert.typeOf(yerbamate.run, 'function');
        assert.ok(yerbamate.loadPackage);
        assert.typeOf(yerbamate.loadPackage, 'function');
        assert.ok(yerbamate.stop);
        assert.typeOf(yerbamate.stop, 'function');
    });
    it("successCode()", function() {
        assert.ok(yerbamate.successCode);
        assert.typeOf(yerbamate.successCode, 'function');
        assert.strictEqual(yerbamate.successCode(), false);
        assert.strictEqual(yerbamate.successCode(0), true);
        assert.strictEqual(yerbamate.successCode("0"), false);
        assert.strictEqual(yerbamate.successCode(1), false);
        assert.strictEqual(yerbamate.successCode(-1), false);
        assert.strictEqual(yerbamate.successCode(false), false);
        assert.strictEqual(yerbamate.successCode(true), false);
        assert.strictEqual(yerbamate.successCode(2), false);
    });
    it("Running from package.json", function(done) {
        const pkg = yerbamate.loadPackage(__dirname + '/config/test_package.json');
        assert.ok(pkg);
        yerbamate.run(pkg.start, pkg.dir, {}, function(code, outs, errs) {
            config.checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "2");
            yerbamate.run(pkg.main, pkg.dir, {}, function(code, outs, errs) {
                config.checkDefaultOutput(code, outs, errs);
                assert.strictEqual(outs[1], "2");
                done();
            });
        });

    });
});
