const process = require("process");
const Library = require("../library.js");
const { DEFAULT_PREFERENCES } = require("../utils/preferences.js");

class SourceStat{

	name = "";
	nGames = 0;
	nInstalledGames = 0;

	constructor(name){
		this.name = name;
	}

	toString(){
		return `${this.name} : ${this.nInstalledGames} installed - ${this.nGames} found`;
	}

	toArray(){
		return [this.name, this.nInstalledGames, this.nGames];
	}
}

function genericSortNumber(a, b){
	if (a === b) return 0;
	else if (a < b) return 1;
	else return -1;
}

/**
 * Run the library scan test
 */
async function testLibraryScan(){

	let DO_DISPLAY_GAMES_LIST = false;

	// Help cli argument
	const indexOfHelpArg = process.argv.indexOf("--help");
	if (indexOfHelpArg !== -1){
		process.argv.pop(indexOfHelpArg);
		console.log(
			// eslint-disable-next-line indent
`Usage
	node libraryScanTest.test.js [--display] [--help] [...sources]
	
Parameters
	--help    : (optional) Displays this help and exits
	--display : (optional) Also display the game list in stdout
	sources   : (optional) Names of sources to scan, space separated. If absent, the default config will be used.
`
		);
		return;
	}

	// Display cli argument
	const indexOfDisplayArg = process.argv.indexOf("--display");
	if (indexOfDisplayArg !== -1){
		process.argv.pop(indexOfDisplayArg);
		DO_DISPLAY_GAMES_LIST = true;
	}

	// Define sources to scan
	let sources = DEFAULT_PREFERENCES.scan.enabledSources;
	if (process.argv.length > 2){
		sources = process.argv.slice(2);
	}
	console.log(`Scanning ${sources.join(", ")}`);

	// Scan and sort library
	const library = new Library(sources, true, true);
	await library.scan();
	await library.sort("name", 1);

	// General stats
	const nInstalled = library.games.filter(g=>g.isInstalled).length;
	if (DO_DISPLAY_GAMES_LIST){
		console.log();
		library.displayInConsole();
	}
	console.log();
	console.log(`Library contains ${library.games.length} games (${nInstalled} installed)`);

	// Per source stats
	const sourcesStats = {};
	for (const sourceName of sources){
		sourcesStats[sourceName] = new SourceStat(sourceName);
	}
	for (const game of library.games){
		const stat = sourcesStats[game.source];
		if (typeof stat !== "undefined"){
			stat.nGames++;
			if (game.isInstalled){
				stat.nInstalledGames++;
			}
		}
	}
	const sourcesStatsArray = Object.values(sourcesStats);
	sourcesStatsArray.sort((a, b)=>genericSortNumber(a.nGames, b.nGames));
	console.table(sourcesStatsArray, ["name", "nInstalledGames", "nGames"]);

}
testLibraryScan();