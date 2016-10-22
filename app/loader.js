/*
Loads all the scripts and binaries data from a module package.json
>Based on [pkginfo](https://github.com/indexzero/node-pkginfo)
*/

var path = require('path');

function findPackageJson(pmodule, dir) {
    if (!dir) {
        dir = path.dirname(pmodule.filename || pmodule.id);
    }

    if (dir === '/') {
        throw new Error('Could not find package.json up from ' +
            (pmodule.filename || pmodule.id));
    } else if (!dir || dir === '.') {
        throw new Error('Cannot find package.json from unspecified directory');
    }

    var contents;
    try {
        contents = require(dir + '/package.json');
    } catch (error) {}

    if (contents) return {
        dir: dir,
        main: contents.main ? "node " + contents.main : undefined,
        start: contents.scripts ? contents.scripts.start : undefined,
        bin: contents.bin,
        scripts: contents.scripts
    };

    else return findPackageJson(pmodule, path.dirname(dir));
}


module.exports = function(pmodule) {
    return findPackageJson(pmodule);
};
