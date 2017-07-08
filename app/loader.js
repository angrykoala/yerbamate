"use strict";
/*
Loads all the scripts and binaries data from a module package.json
>Based on [pkginfo](https://github.com/indexzero/node-pkginfo)
*/

const path = require('path');
const fs = require('fs');


function getContents(content, dir) {
    return {
        dir: dir,
        main: content.main ? "node " + content.main : undefined,
        start: content.scripts ? content.scripts.start : undefined,
        bin: content.bin || {},
        scripts: content.scripts || {}
    };
}

function moduleLoader(pmodule, dir) {
    dir = processDir(pmodule, dir);
    validateDir(pmodule, dir);

    let contents;
    try {
        contents = require(dir + '/package.json');
    } catch (error) {}

    if (contents) return getContents(contents, dir);

    else return moduleLoader(pmodule, path.dirname(dir));
}

function processDir(pmodule, dir) {
    if (!dir) {
        dir = path.dirname(pmodule.filename || pmodule.id);
    }


    return dir;
}

function validateDir(pmodule, dir) {
    if (dir === '/') {
        throw new Error('Could not find package.json up from ' + (pmodule.filename || pmodule.id));
    } else if (!dir || dir === '.') {
        throw new Error('Cannot find package.json from unspecified directory');
    }
}


function fileLoader(filepath) {
    filepath = path.resolve(filepath);
    let contents;
    try {
        contents = fs.readFileSync(filepath, 'utf-8');
    } catch (error) {
        throw error;
    }
    return getContents(JSON.parse(contents), path.dirname(filepath));
}

module.exports = function(pmodule) {
    if (!pmodule) throw new Error("yerbamate loader - Not module found");
    if (typeof pmodule === "string") return fileLoader(pmodule);
    else return moduleLoader(pmodule);
};
