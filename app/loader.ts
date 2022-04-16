/*
Loads all the scripts and binaries data from a module package.json
>Based on [pkginfo](https://github.com/indexzero/node-pkginfo)
*/
import path from 'path';
import fs from 'fs';

class Loader {
    static getContents(content: any, dir: any) {
        return {
            dir: dir,
            main: content.main ? "node " + content.main : undefined,
            start: content.scripts ? content.scripts.start : undefined,
            bin: content.bin || {},
            scripts: content.scripts || {}
        };
    }

    static moduleLoader(pmodule: any, dir?: any): any {
        dir = Loader.processDir(pmodule, dir);
        Loader.validateDir(pmodule, dir);

        let contents;
        try {
            contents = require(dir + '/package.json');
        } catch (error) { }

        return (contents) ? Loader.getContents(contents, dir) : Loader.moduleLoader(pmodule, path.dirname(dir));
    }

    static processDir(pmodule: any, dir?: any) {
        if (!dir) {
            dir = path.dirname(pmodule.filename || pmodule.id);
        }
        return dir;
    }

    static validateDir(pmodule: any, dir: any) {
        if (dir === '/') {
            throw new Error('Could not find package.json up from ' + (pmodule.filename || pmodule.id));
        } else if (!dir || dir === '.') {
            throw new Error('Cannot find package.json from unspecified directory');
        }
    }


    static fileLoader(filepath: any) {
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


export function loader(pmodule: any) {
    if (!pmodule) throw new Error("yerbamate loader - Not module found");
    return (typeof pmodule === "string") ? Loader.fileLoader(pmodule) : Loader.moduleLoader(pmodule);
};
