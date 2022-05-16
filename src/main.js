const preferences = require("./utils/preferences.js");
const Library     = require("./library.js");

class App{

	preferences = undefined;
	library = undefined;

	// ---------------------------- Regular methods ----------------------------

	/**
	 * Start the app
	 * @public
	 */
	start = async ()=>{

		// Get user preferences
		this.preferences = await preferences.readUserFileSafe();

		// Create library
		this.library = new Library(
			this.preferences.scan.enabledSources,
			this.preferences.scan.preferCache,
			this.preferences.scan.warnings
		);

		// Start UI
		// TODO

		// Scan for games
		await this.library.scan();
		this.library.displayInConsole(); // ! Temporary.

	}

}

const app = new App();
app.start();