import { Library } from "../library.js";

/**
 * Run the library scan test
 * @param {boolean} displayLibrary - Whether to display the game list or not
 */
export default async function testLibraryScan(sources = Library.sources, displayLibrary = false){ 

	// Scan for games, sort them and display the list
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
	let counts = new Object();
	for (let game of library.games){ 
		if (!counts.hasOwnProperty(game.source)){
			counts[game.source] = 1;
		} else {
			counts[game.source]++;
		}
	}

	// Sort sources per count
	let sortedCounts = [];
	for (let source in counts){
		sortedCounts.push({source: source, count: counts[source]});
	}
	sortedCounts.sort((a,b)=>{
		if (a.count === b.count) return 0;
		else if (a.count < b.count) return 1;
		else return -1;
	});

	// Display number of games per source
	for (let count of sortedCounts){
		let message = `- ${count.count} from ${count.source}`;
		console.log(message);
	}

}