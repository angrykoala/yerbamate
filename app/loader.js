/*
 Loads all the scripts and binaries data from a module package.json
 >Based on [pkginfo](https://github.com/indexzero/node-pkginfo)
 */

const path = require('path');
const fs = require('fs');

class Loader {
    static getContents(content, dir) {
        return {
            dir,
            main: content.main ? "node " + content.main : undefined,
            start: content.scripts ? content.scripts.start : undefined,
            bin: content.bin || {},
            scripts: content.scripts || {}
        };
    }

    static moduleLoader(pmodule, dir) {
        if (!dir) {
            dir = path.dirname(pmodule.filename || pmodule.id);
        }

        if (dir === '/') {
            throw new Error('Could not find package.json up from ' +
                (pmodule.filename || pmodule.id));
        } else if (!dir || dir === '.') {
            throw new Error('Cannot find package.json from unspecified directory');
        }

        let contents;

        try {
            contents = require(dir + '/package.json');
        } catch (error) {
        }

        return (contents) ?
            Loader.getContents(contents, dir) :
            Loader.moduleLoader(pmodule, path.dirname(dir));
    }

    static fileLoader(filepath) {
        filepath = path.resolve(filepath);
        let contents;
        try {
            contents = fs.readFileSync(filepath, 'utf-8');
        } catch (error) {
            throw error;
        }
        return Loader.getContents(JSON.parse(contents), path.dirname(filepath));
    }
}


module.exports = (pmodule) => {
    if (!pmodule) {
        throw new Error('yerbamate loader - Not module found');
    }

    return (typeof pmodule === 'string') ?
        Loader.fileLoader(pmodule) :
        Loader.moduleLoader(pmodule);
};