const assert = require('chai').assert;
const yerbamate = require('..');

const {
    run
} = require('..');

describe("Main Export As JavaScript", () => {
    it("Main Functions Exist", () => {
        assert.ok(yerbamate);
        assert.ok(yerbamate.loadPackage);
        assert.ok(yerbamate.run);
        assert.ok(yerbamate.stop);
        assert.ok(yerbamate.isSuccessCode);
        assert.ok(run);
    });
});
