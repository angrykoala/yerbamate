var assert = require('chai').assert;

var yerbamate = require('../index');
var config = require('./config/config');

describe("Yerbamate index", function() {
    it("Main Functions", function() {
        assert.ok(yerbamate);
        assert.ok(yerbamate.run);
        assert.typeOf(yerbamate.run, 'function');
        assert.ok(yerbamate.loadPackage);
        assert.typeOf(yerbamate.loadPackage, 'function');
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
        var pkg = yerbamate.loadPackage(__dirname + '/config/test_package.json');
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