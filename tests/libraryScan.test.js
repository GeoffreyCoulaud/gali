const Library = require("../library.js");
const { DEFAULT_PREFERENCES } = require("../utils/preferences.js");

/**
 * Run the library scan test
 * @param {boolean} displayLibrary - Whether to display the game list or not
 */
async function testLibraryScan(displayLibrary = false){

	// Scan for games, sort them and display the list
	const sources = DEFAULT_PREFERENCES.scan.enabledSources;
	const library = new Library(sources, true, true);
	await library.scan();
	await library.sort("name", 1);
	if (displayLibrary){
		console.log("");
		library.displayInConsole();
	}

	// Display total number of games
	console.log();
	console.log(`Library contains ${library.games.length} games in total`);

	// Count games per source
	const counts = new Object();
	for (const game of library.games){
		if (!Object.prototype.hasOwnProperty.call(counts, game.source)){
			counts[game.source] = 1;
		} else {
			counts[game.source]++;
		}
	}

	// Sort sources per count
	const sortedCounts = [];
	for (const source in counts){
		sortedCounts.push({source: source, count: counts[source]});
	}
	sortedCounts.sort((a, b)=>{
		if (a.count === b.count) return 0;
		else if (a.count < b.count) return 1;
		else return -1;
	});

	// Display number of games per source
	for (const count of sortedCounts){
		const message = `- ${count.count} from ${count.source}`;
		console.log(message);
	}

}
testLibraryScan();