import { Library } from "./library.js";

// Scan and sort
let library = new Library(
	["lutris"], 
	true,
	true
);
await library.scan();
await library.sort("name", 1);

// Display library
library.displayInConsole();
console.log(`Library contains ${library.games.length} games`);