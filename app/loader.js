/*
Loads all the scripts and binaries data from a module package.json
>Based on [pkginfo](https://github.com/indexzero/node-pkginfo)
*/

var path = require('path');

module.exports= function(pmodule, dir) {
  if (! dir) {
    dir = path.dirname(pmodule.filename || pmodule.id);
  }

  if (dir === '/') {
    throw new Error('Could not find package.json up from ' +
                (pmodule.filename || pmodule.id));
  }
  else if (!dir || dir === '.') {
    throw new Error('Cannot find package.json from unspecified directory');
  }

  var contents;
  try {
    contents = require(dir + '/package.json');
  } catch (error) {}

  if (contents) return {
      "path": dir,
      content: {
          bin: contents.bin,
          start: contents.scripts ? contents.scripts.start : undefined,
          index: contents.index ? "node "+contents.index : undefined
      }
  };

  else return findPackageJson(pmodule, path.dirname(dir));
};
