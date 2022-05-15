const { StartOnlyGameProcessContainer } = require("./StartOnlyGameProcessContainer.js");
const child_process = require("child_process");

/**
 * A wrapper for legendary game process management.
 * Doesn't support stop and kill !
 * @property {string} appName - The epic games store app name, used to start the game
 */
class LegendaryGameProcessContainer extends StartOnlyGameProcessContainer {

	commandOptions = ["legendary"];

	/**
	 * Create a legendary game process container
	 * @param {string} appName - The epic games store app name
	 */
	constructor(appName) {
		super();
		this.appName = appName;
	}

	// ! There is no way (AFAIK) to control a legendary game's life cycle from the launcher.
	/**
	 * Start the game in a subprocess
	 * @param {boolean} offline - Whether to start the game offline. Defaults to false.
	 */
	async start(offline = false) {
		const command = await this._selectCommand();
		const args = ["launch", this.appName];
		if (offline){
			args.splice(1, 0, "--offline");
		}
		this.process = child_process.spawn(
			command,
			args,
			this.constructor.defaultSpawnOptions
		);
		this.process.unref();
		this._bindProcessEvents();
		return;
	}

}

module.exports = {
	LegendaryGameProcessContainer
};