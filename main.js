import { Library } from "./library.js";

function sleep(millis){return new Promise((resolve)=>{
	setTimeout(resolve, millis);
})}

// Scan and sort
console.log("Getting games...");
let library = new Library(
	["lutris"], 
	true,
	true
);
await library.scan();
await library.sort("name", 1);

// Display library
console.log("Games list :");
library.displayInConsole();
console.log(`Library contains ${library.games.length} games`);

// Test - Start cemu in lutris
// Find the game
const findCriteria = {key: "gameSlug", value: "cemu"};
const foundGame = library.games.filter(game => game[findCriteria.key] === findCriteria.value)?.[0];
if (!foundGame){
	console.error(`No game found with the gameSlug "cemu"`);
} else {
	// Start
	console.log(`Starting ${foundGame.name}`);
	foundGame.processContainer.start();
	// Wait 10s
	await sleep(10000);
	// Stop
	console.log(`Stopping ${foundGame.name}`);
	foundGame.processContainer.stop();
}