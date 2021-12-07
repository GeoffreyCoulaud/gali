/* eslint-disable max-lines-per-function */
const preferences = require("../../utils/preferences.js");
const sleep       = require("../../utils/sleep.js");
const cli         = require("../../utils/cli.js");
const Library     = require("../../library.js");

function help(){
	console.log(
		// eslint-disable-next-line indent
`Tests the life cycle functions of a game.
This will read the user sources preferences, scan the library and try to start
then stop a matching game.

Usage 
	node gameStart.test.js [-k] [-t] <game-source-name-pair>

Options
	-t    Specify a timeout in seconds after which the game will be stopped. 
	      Default is 10 seconds.
	-k    If present, the game will be killed and not stopped

Examples
	node gameStart.test.js "Cemu" "Lutris"
	node gameStart.test.js -t 5 "Cemu" "Lutris"
	node gameStart.test.js -k -t 30 "Cemu" "Lutris"
`
	);
}

function testGameStart(){
	return new Promise((resolve, reject)=>{

		// CLI arguments
		if (cli.getPopBoolArgv("--help")){
			help();
			resolve(0);
		}
		const FORCE_KILL = cli.getPopBoolArgv("-k");
		let TIMEOUT_SECONDS = cli.getPopValuesArgv("-t", 1)[0];
		TIMEOUT_SECONDS = (TIMEOUT_SECONDS) ? parseInt(TIMEOUT_SECONDS) : 10;

		// Game name and source
		if (process.argv.length < 4){
			console.error("Not enough arguments. Use --help for usage.");
			reject(1);
		}
		const gameName = process.argv[2];
		const gameSourceName = process.argv[3];

		// Scan library
		let library;
		preferences.readUserFileSafe().then(p=>{
			library = new Library(
				p.scan.enabledSources,
				p.scan.preferCache,
				true
			);
			return library.scan();
		}).then(()=>{

			// Find the game
			const game = library.games.find(x=>(x.name === gameName && x.source === gameSourceName));
			if (!game){
				console.log("No matching game found");
				reject(2);
			}

			// Start, wait, stop
			const TIMEOUT_MILLIS = TIMEOUT_SECONDS * 1000;
			game.processContainer.on("error", (error)=>{
				console.error(`Error while starting child process : ${error}`);
				reject(3);
			});
			game.processContainer.on("exit", (code)=>{
				if (code){
					console.warn(`Child process exited with code ${code}`);
					reject(4);
				} else {
					resolve(0);
				}
			});
			game.processContainer.start()
				.then(()=>sleep(TIMEOUT_MILLIS))
				.then(()=>{
					if (game.processContainer.isRunning){
						let message = "";
						if (FORCE_KILL){
							game.processContainer.kill();
							message += "Killing";
						} else {
							game.processContainer.stop();
							message += "Stopping";
						}
						message += ` ${game.name} after ${TIMEOUT_SECONDS}s`;
						console.log(message);
					}
					resolve(0);
				});
		});
	});
}

testGameStart().then(()=>{
	process.exit(0);
}).catch((code)=>{
	process.exit(code);
});