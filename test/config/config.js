var assert = require('chai').assert;

module.exports = {
    checkDefaultOutput: function(code, outs, errs) {
        assert.ok(outs);
        assert.ok(errs);
        assert.strictEqual(code, 0, "Execution was not successfull");
        assert.lengthOf(outs, 2);
        assert.lengthOf(errs, 1);
        assert.strictEqual(outs[0], "Example js running");
        assert.strictEqual(errs[0], "Warning example");
    },
    testScript: "example.js"
};
