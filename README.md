Yerbamate
=========
_by @angrykoala_

[![npm version](https://badge.fury.io/js/yerbamate.svg)](https://badge.fury.io/js/yerbamate)
[![Build Status](https://travis-ci.org/angrykoala/yerbamate.svg?branch=master)](https://travis-ci.org/angrykoala/yerbamate)
[![codecov](https://codecov.io/gh/angrykoala/yerbamate/branch/master/graph/badge.svg)](https://codecov.io/gh/angrykoala/yerbamate)


> The js task-runner library for command-line interfaces testing.

Sometimes, you want to add automated tests for your node-based CLI. With _Yerbamate_ now you can test your programs directly within your favorite testing framework like _mocha_ without the mess of creating complex gulp pipelines or adding extra bash scripts. Just with ol' good Javascript.

Yerbamate consists in a **Runner** for asyncronous execution of commands and a **Loader** to easily import the information of your _package.json_ without hard-coding paths and variables in your tests.

## Installation
To install yerbamate, simply execute `npm install --save-dev yerbamate` in your node project.

## Usage
With _yerbamate_ you can easily test commands from your favorite Javascript testing framework simply importing it with `require('yerbamate')` and calling `yerbamate.run`.

```js
const yerbamate = require('yerbamate');

yerbamate.run("cat my_file.md", (code, out, errs) => {
    if (!yerbamate.successCode(code)) console.log("Error: " + errs[0]);
    else console.log("Success - " + out);
});
```

_Yerbamate_ also provides easy access to you package.json defined scripts and commands, so you can test your module easily with `yerbamate.loadPackage`.

```js
const yerbamate = require('yerbamate');
const pkg = yerbamate.loadPackage(module);

//Test the package.json start script
yerbamate.run(pkg.start, pkg.dir, {
    args: "[my arguments]"
}, function(code, out, errs) {
    if (!yerbamate.successCode(code)) console.log("Process exited with error code");
    if (errs.length > 0) console.log("Errors in process:" + errs.length);
    console.log("Output: " + out[0]);
});
```

## Documentation

* `loadPackage(module)` Will load your package.json module data, the returned object will contain the path to the `package.json` file, `main` and `start` script as well as `bin` and `scripts` objects from package.json.

* `run(command, dir, options, done)` Will run the given command as a child_process in the given path. The callback will return the execution code of the process, an array with all the console outputs and an array with all the error outputs. The dona callback parameters stdout and stderr will return a different element per line break. Empty line-breaks will be ignored. The command returns the child process. The following options are supported:

  * `args` an array or string of the arguments to be passed to the command.
  * `stdout` callback for stdout events.
  * `stderr` callback for stderr events.
  * `env` environmnet variables to be set when the command is executed.
  * `maxOutputSize` Sets the maximum output that will be returned to the `done` callback, only the last characters will be sent. If none is set, all the output will be returned. The characters count also takes in account new line characters.


* `stop(process)` Will kill the given process, sending a `SIGTERM` signal.

* `successCode(code)` Will return true if the given process code is 0, false otherwise.

## Contributors
If you want to contribute to yerbamate please:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md).
2. Fork from [dev branch](https://github.com/angrykoala/yerbamate/tree/dev).
3. Make sure tests passes before pull request.
4. Check the opened and closed issues before creating one.

Thanks for your help!

## Acknowledgments
* [pkginfo](https://github.com/indexzero/node-pkginfo) as inspiration for yerbamate loader.

>Yerbamate is developed under GNU GPL-3 license by @angrykoala.
