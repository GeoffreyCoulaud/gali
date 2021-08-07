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

// Find the game
function findGame(game){
	return (game.name === "Cemu");
}
const game = library.games.filter(findGame)?.[0];
if (!game){
	console.error(`No game found`);
} else {
	console.log(game.corePath);
	// Start
	console.log(`Starting ${game.name}`);
	game.processContainer.start();
	game.processContainer.on("exit", (code, signal)=>{
		console.log(`Stopped ${game.name} (code ${code}, signal ${signal})`);
	});
	game.processContainer.on("error", (error)=>{
		console.error(`Error on game process : ${error}`);
	});
	game.processContainer.on("spawn", ()=>{
		console.log(`Spawned game process ${game.processContainer.process.pid}`);
	});
	// Wait 10s
	await sleep(10000);
	// Stop
	console.log(`Stopping ${game.name}`);
	game.processContainer.stop();
}