"use strict";

const assert = require('chai').assert;
const path = require('path');

const loader = require('../app/loader');

describe("Loader", function() {
    it("Check module content", function() {
        assert.ok(loader);
        const pkg = loader(module);
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
        let pkg;
        assert.throws(loader);
        try {
            pkg = loader();
        } catch (e) {
            assert.ok(e);
            assert.notOk(pkg);
        }
    });

    it("Loading from package.json file", function() {
        const pkg = loader(path.join(__dirname, "../package.json"));
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
        let pkg;
        try {
            pkg = loader("falsePath");
        } catch (e) {
            assert.ok(e);
            assert.notOk(pkg);
        }
    });

    it("Invalid module", function() {
        assert.throws(loader);
        const testModule = {
            filename: "falsePath"
        };
        let pkg;
        try {
            pkg = loader(testModule);
        } catch (e) {
            assert.ok(e);
            assert.notOk(pkg);
        }
    });

    it("Module with id", function() {
        const testModule = {
            id: path.join(__dirname, "./config/test_package.json")
        };
        let pkg;
        pkg = loader(testModule);
        assert.ok(pkg);
        assert.ok(pkg.scripts);
        assert.ok(pkg.scripts.test);
    });

    it("Empty package.json", function() {
        let pkg;
        const p = path.join(__dirname, "./config/empty_package.json");
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
