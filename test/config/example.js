console.log("Example js running");
console.error("Warning example");
console.log(process.argv.length);
if (process.argv[2] === "-error") throw new Error("Fatal Error");