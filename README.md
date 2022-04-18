Yerbamate
=========
_by @angrykoala_

[![npm version](https://badge.fury.io/js/yerbamate.svg)](https://badge.fury.io/js/yerbamate)

> The JavaScript library for command-line testing.

Sometimes, you want to add automated tests for your CLI. With _Yerbamate_, you can test your CLI directly within your favorite testing framework like _mocha_ without the mess of creating scripts or child_process:

```javascript
const yerbamate = require('yerbamate');

yerbamate.run("cat my_file.md", (code, out, errs) => {
    if (!yerbamate.isSuccessCode(code)) console.log("Error: " + errs);
    else console.log("Success - " + out);
});
```

## Getting started
Run `npm install --save-dev yerbamate` to install yerbamate as a dev dependency.

With _yerbamate_ you can easily test commands from you JavaScript testing framework by running `yerbamate.run`:

```js
const yerbamate = require('yerbamate');

yerbamate.run("cat my_file.md", (code, out, errs) => {
    if (!yerbamate.isSuccessCode(code)) console.error("Error:", errs.join("\n")); // In case of errors, log stderr
    else console.log("Success - ", out.join("\n")); // In case of success, log all the stdout output
});
```

## Features

* TypeScript support.
* Real-tip `stdio` updates.

## Usage
Yerbamate comes with 4 functions:
* `run` lets you run a command through a childProcess and handle its output.
* `stop` to stop (kill) a running process.
* `loadPackage` to load scripts in the project package.json for easy testing.
* `isSuccessCode` to check the success code returned by `run`.

### Running scripts
The command `yerbamate.run(command, path, settings, done)` will run the given command, as a string, in a child process, and send the results to the callback, once the
task has _stopped_, _errored_ or _finished_. `run` will also return the `ChildProcess` executing the task.

The callback receives 3 arguments:
* `code`: The status code, as a number (if available). Code `0` means the task has finished successfully. The code `143` will be returned if the task have being killed with `stop`.
* `out`: A string containing `stdout` output. If the process has no output, this variable will be an empty string.
* `err`:  A string containing `stderr` output. Note that an error in the process execution does not guarantee this string will contain any output.

Optionally, `run` can receive a `path` argument, a string to define the path in which to run the command:

```js
yebamate.run("pwd", "/home/angrykoala/", (code, out) => {
    console.log(out); // /home/angrykoala/
})
```
The path will be processed before executing the command, to ensure it is standard across different environments. Tilde (`~`) is supported as the current user `home` directory.

> NOTE: If `run` fails while spawning processes, it will return a `null` process and call `done` with error code `1` and the error message as part of the output.

#### Options
An object can be passed, optionally, as third argument, with settings for the execution. All settings are optional:

* `args` An array or string of arguments to be passed to the command.
* `stdout` Callback for `stdout` events. This lets real-time updates of the `stdout` output. This callback receives a string.
* `stderr` Callback for `stderr` events. This allows for real-time updates of the `stderr` output. This callback receives a string.
* `env` Environment variables to be set when the command is executed. Note that env variables from the current process will always be added, variables set through this setting will override default env variables.
* `maxOutputSize` Sets the maximum output that will be returned to the `done` callback, only the last characters will be sent. If none is set, all the output will be returned. Characters count also takes in account new line characters.

#### Using real-time updates of stdio

```js
yerbamate.run("bash my_script.sh", {
    stdout: (data) => {
        console.log("Output:", data);
    },
    stderr: (err) => {
        console.log("Error:", err)
    }
}, () => {
    // Note that the full output is still available in the callback, once the process has finished.
});
```

#### Stopping a running task
The command `run` will return a [childProcess](https://nodejs.org/api/child_process.html), if needed, the process can be killed with the command `stop`:

```js
const proc = yerbamate.run("bash long_task.sh", (code)=>{
    console.log(code); // 143
});

yerbamate.stop(proc));
```

Optionally, `stop` may receive a callback, that will be called once the task has been killed. Note that the process will be stopped with a `SIGTERM`, and any child process of it will be killed as well.

### Loading scripts from package.json
_Yerbamate_ provides easy access to you `package.json` defined scripts, so you can test your module easily with `yerbamate.loadPackage`:

```js
const yerbamate = require('yerbamate');
const pkg = yerbamate.loadPackage(module); // module refers to the module being executed.

//Test the package.json start script
yerbamate.run(pkg.start, pkg.dir, {
    args: "[my arguments]"
}, (code, out, errs) => {
    if (!yerbamate.isSuccessCode(code)) console.log("Process exited with error code");
    console.log("Output: " + out);
});
```

The returned `pkg` object will contain the following fields:

* `path` Path to the `package.json` file.
* `main` Path defined as the main entry point.
* `start` Start script.
* `bin` Bin object from `package.json`.
* `scripts` Scripts object.

#### Loading from a different package.json
`loadPackage(module)` is an easy way to access the local, executed `package.json`. However, a different package file could be loaded by passing its path:

```js
const pkg = yerbamate.loadPackage("./my_project/package.json");
```

### Using TypeScript
`yerbamate` is fully typed and supports TypeScript. take the following example:

```ts
import * as yerbamate from 'yerbamate';

yerbamate.run("cat my_file.md", (code: number, out: string, errs: string):void => {
    if (!yerbamate.isSuccessCode(code)) console.log("Error: " + errs);
    else console.log("Success - " + out);
});
```

`yerbamate` can also be partially imported:

```ts
import { run, stop } from 'yerbamate';
```

## Development
To develop for `yerbamate`:

1. Clone or fork this repository
2. Run `npm install` (Node 12 or higher and npm must be installed).
3. Run tests with `npm test`
    * Test coverage in html format can be generated afterwards with `npm run html-coverage`
4. Compile wiht `npm run tsc`

## Contributors
If you want to contribute to yerbamate please:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md).
2. Fork from [dev branch](https://github.com/angrykoala/yerbamate/tree/dev).
3. Make sure tests pass before pull request.
4. Check the opened and closed issues before creating one.

Thanks for your help!

## Acknowledgments
* [pkginfo](https://github.com/indexzero/node-pkginfo) as inspiration for yerbamate `package.json` loader.
* [untildify](https://www.npmjs.com/package/untildify)
* [tree-kill](https://www.npmjs.com/package/tree-kill)

> Yerbamate is developed under MIT license by @angrykoala.
