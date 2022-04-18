/*
Loads all the scripts and binaries data from a module package.json
> Based on [pkginfo](https://github.com/indexzero/node-pkginfo)
*/
import path from 'path';
import fs from 'fs';


type PackageJSON = {
    main?: string,
    scripts?: Record<string, string>,
    bin?: Record<string, string>
}

export type PackageData = {
    dir: string,
    main?: string,
    start?: string,
    bin: Record<string, string>,
    scripts: Record<string, string>
}

export function loadPackage(pmodule: string | NodeModule) {
    if (!pmodule) throw new Error("yerbamate loader - Not module found");
    return (typeof pmodule === "string") ? fileLoader(pmodule) : moduleLoader(pmodule);
};

function fileLoader(filepath: string): PackageData {
    filepath = path.resolve(filepath);
    const contents = fs.readFileSync(filepath, 'utf-8');
    return getContents(JSON.parse(contents) as PackageJSON, path.dirname(filepath));
}

function getContents(content: PackageJSON, dir: string): PackageData {
    return {
        dir: dir,
        main: content.main ? `node ${content.main}` : undefined,
        start: content.scripts ?.start,
        bin: content.bin || {},
        scripts: content.scripts || {}
    };
}

function moduleLoader(pmodule: NodeModule, filePath?: string): PackageData {
    const dirPath = processDir(pmodule, filePath);
    validateDir(pmodule, dirPath);

    let contents: PackageJSON | undefined;
    try {
        contents = require(dirPath + '/package.json');
    } catch (error) { }

    if (contents) {
        return getContents(contents, dirPath);
    } else {
        const parentPath = path.dirname(dirPath);
        return moduleLoader(pmodule, parentPath);
    }
}

function processDir(pmodule: NodeModule, dir: string | undefined): string {
    if (!dir) {
        return path.dirname(pmodule.filename || pmodule.id);
    }
    return dir;
}

function validateDir(pmodule: NodeModule, dir: string): void {
    if (dir === '/') {
        throw new Error('Could not find package.json up from ' + (pmodule.filename || pmodule.id));
    } else if (!dir || dir === '.') {
        throw new Error('Cannot find package.json from unspecified directory');
    }
}
