const assert = require('chai').assert;
const yerbamate = require('..');

const {
    run
} = require('..');

assert.ok(yerbamate);
assert.ok(yerbamate.loadPackage);
assert.ok(yerbamate.run);
assert.ok(yerbamate.stop);
assert.ok(yerbamate.isSuccessCode);
assert.ok(run);

console.log("JavaScript export is OK")
