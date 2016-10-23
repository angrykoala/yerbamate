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
    
    it.skip("Loading from package.json file",function(){
        throw new Error("Not implemented yet");        
    })
});
