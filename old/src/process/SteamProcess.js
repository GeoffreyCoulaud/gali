const Process = require("./Process.js");

/**
 * A wrapper for steam game process management
 * @property {string} appId - A steam appid, used to invoke steam
 */
class SteamProcess extends Process {

	command = "steam";

	isStoppable = false;
	isKillable = false;

	constructor (game) {
		super();
		this.args.push(`steam://rungameid/${game.appId}`);
	}

}

module.exports = SteamProcess;