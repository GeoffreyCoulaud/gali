import { Library } from "./library.js";

console.log("Getting games...");
let lib = new Library();
lib.warn = true;
await lib.scan();
await lib.sort("name", 1);

console.log("\nGames list :");
lib.displayInConsole();