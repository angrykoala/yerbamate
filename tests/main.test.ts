import { assert } from 'chai';

import * as yerbamate from '..';
import config from './config/config';

describe("Main", () => {
    it("Main Functions Exist", () => {
        assert.ok(yerbamate);
        assert.ok(yerbamate.run);
        assert.typeOf(yerbamate.run, 'function');
        assert.ok(yerbamate.loadPackage);
        assert.typeOf(yerbamate.loadPackage, 'function');
        assert.ok(yerbamate.stop);
        assert.typeOf(yerbamate.stop, 'function');
    });

    it("Success Code", () => {
        assert.ok(yerbamate.isSuccessCode);
        assert.typeOf(yerbamate.isSuccessCode, 'function');

        assert.strictEqual(yerbamate.isSuccessCode(), false);
        assert.strictEqual(yerbamate.isSuccessCode(0), true);
        assert.strictEqual(yerbamate.isSuccessCode("0"), false);
        assert.strictEqual(yerbamate.isSuccessCode(1), false);
        assert.strictEqual(yerbamate.isSuccessCode(-1), false);
        assert.strictEqual(yerbamate.isSuccessCode(false), false);
        assert.strictEqual(yerbamate.isSuccessCode(true), false);
        assert.strictEqual(yerbamate.isSuccessCode(2), false);
    });

    it("Running from package.json", (done) => {
        const pkg = yerbamate.loadPackage(__dirname + '/config/test_package.json');
        assert.ok(pkg);
        yerbamate.run(pkg.start, pkg.dir, {}, (code: any, outs: any, errs: any) => {
            config.checkDefaultOutput(code, outs, errs);
            assert.strictEqual(outs[1], "2");
            yerbamate.run(pkg.main, pkg.dir, {}, (code: any, outs: any, errs: any) => {
                config.checkDefaultOutput(code, outs, errs);
                assert.strictEqual(outs[1], "2");
                done();
            });
        });

    });
});
