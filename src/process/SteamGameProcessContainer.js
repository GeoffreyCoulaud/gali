const child_process = require("child_process");

const { StartOnlyGameProcessContainer } = require("./StartOnlyGameProcessContainer.js");

/**
 * A wrapper for steam game process management
 * @property {string} appId - A steam appid, used to invoke steam
 */
class SteamGameProcessContainer extends StartOnlyGameProcessContainer {

	commandOptions = ["steam"];

	/**
	 * Create a steam game process container
	 * @param {string} appId - A steam appid
	 */
	constructor(appId) {
		super();
		this.appId = appId;
	}

	// ! There is no way (AFAIK) to control a steam game's life cycle.
	/**
	 * Start the game in a subprocess
	 */
	async start() {
		const command = await this._selectCommand();
		this.process = child_process.spawn(
			command,
			[`steam://rungameid/${this.appId}`],
			this.constructor.defaultSpawnOptions
		);
		this.process.unref();
		this._bindProcessEvents();
		return;
	}

}

module.exports = {
	SteamGameProcessContainer
};