const preferences = require("../../utils/preferences.js");
const cli         = require("../../utils/cli.js");
const Library     = require("../../library.js");
const process     = require("process");

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

function help(){
	console.log(
		// eslint-disable-next-line indent
`Tests the library scanning process.
This will read the user sources preferences, scan the library and report on its
content.

Usage
	node libraryScanTest.test.js [-d]

Options
	-d    Also display the game list in stdout
`
	);
}

/**
 * Run the library scan test
 */
async function testLibraryScan(){

	// CLI arguments
	if (cli.getPopBoolArgv("--help")){
		help();
		return 0;
	}
	const DO_DISPLAY_GAMES_LIST = cli.getPopBoolArgv("-d");

	// Scan and sort library
	const USER_PREFERENCES = await preferences.readUserFileSafe();
	const library = new Library(
		USER_PREFERENCES.scan.enabledSources,
		USER_PREFERENCES.scan.preferCache,
		true
	);
	console.log(`Scanning ${USER_PREFERENCES.scan.enabledSources.join(", ")}`);
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
	for (const sourceName of USER_PREFERENCES.scan.enabledSources){
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
	return 0;

}

testLibraryScan().then(()=>{
	process.exit(0);
}).catch(error=>{
	console.error(error);
	process.exit(1);
});