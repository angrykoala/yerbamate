var assert = require('chai').assert;
var path = require('path');

var loader = require('../app/loader');

describe("Loader", function() {
    it("Check module content", function() {
        assert.ok(loader);
        var pkg = loader(module);
        assert.ok(pkg);
        assert.strictEqual(pkg.dir, path.join(__dirname, '..'));
        assert.strictEqual(pkg.main, 'node index.js');
        assert.ok(pkg.scripts);
        assert.ok(pkg.scripts.test);
        assert.isUndefined(pkg.start);
        assert.ok(pkg.bin);
        assert.lengthOf(Object.keys(pkg.bin), 0);
    });

    it("Invalid module", function() {
        var pkg;
        assert.throws(loader);
        try {
            pkg = loader();
        } catch (e) {
            assert.ok(e);
            assert.notOk(pkg);
        }
    });

    it("Loading from package.json file", function() {
        var pkg = loader(path.join(__dirname, "../package.json"));
        assert.ok(pkg);
        assert.strictEqual(pkg.dir, path.join(__dirname, '..'));
        assert.strictEqual(pkg.main, 'node index.js');
        assert.ok(pkg.scripts);
        assert.ok(pkg.scripts.test);
        assert.isUndefined(pkg.start);
        assert.ok(pkg.bin);
        assert.lengthOf(Object.keys(pkg.bin), 0);
    });

    it("Invalid path", function() {
        assert.throws(loader);
        var pkg;
        try {
            pkg = loader("falsePath");
        } catch (e) {
            assert.ok(e);
            assert.notOk(pkg);
        }
    });

    it("Invalid module", function() {
        assert.throws(loader);
        var testModule = {
            filename: "falsePath"
        }
        var pkg;
        try {
            pkg = loader(testModule);
        } catch (e) {
            assert.ok(e);
            assert.notOk(pkg);
        }
    });

    it("Module with id", function() {
        var testModule = {
            id: path.join(__dirname, "./config/test_package.json")
        }
        var pkg;
        pkg = loader(testModule);
        assert.ok(pkg);
        assert.ok(pkg.scripts);
        assert.ok(pkg.scripts.test);
    });

    it("Empty package.json", function() {
        var pkg;
        var p = path.join(__dirname, "./config/empty_package.json");
        pkg = loader(p);
        assert.ok(pkg);
        assert.ok(pkg.dir);
        assert.strictEqual(pkg.dir, path.join(p, ".."));
        assert.isUndefined(pkg.main);
        assert.isUndefined(pkg.start);
        assert.lengthOf(Object.keys(pkg.bin), 0);
        assert.lengthOf(Object.keys(pkg.scripts), 0);
    });
});
