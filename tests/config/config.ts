import { assert } from 'chai';

export default {
    checkDefaultOutput(code: number | null, outs: string, errs: string) {
        assert.ok(outs);
        assert.ok(errs);
        assert.strictEqual(code, 0, "Execution was not successfull");
        assert.strictEqual(outs.split("\n")[0], "Example js running");
        assert.strictEqual(errs.split("\n")[0], "Warning example");
    },
    testScript: "example.js"
};
