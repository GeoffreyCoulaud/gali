import { Library } from "./library.js";

console.log("Getting games...");
let lib = new Library();
await lib.scan();
await lib.sort("source", 1);

console.log("Games list :");
lib.displayInConsole();