import { Library } from "./library.js";

console.log("Getting games...");

let library = new Library(
	Library.sources, 
	true,
	true
);
await library.scan();
await library.sort("name", 1);

console.log("\nGames list :");

library.displayInConsole();
console.log(`Library contains ${library.length} games`);