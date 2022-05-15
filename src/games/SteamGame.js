const { Game } = require("./Game.js");

/**
 * Class representing a steam game
 */
class SteamGame extends Game {

	platform = "PC";

	/**
	 * Create a steam game
	 * @param {string} appId - A steam appid
	 * @param {string} name - The game's displayed name
	 * @param {boolean} isInstalled - The game's installed state
	 */
	constructor(appId, name, isInstalled = undefined) {
		super(name);
		this.appId = appId;
		this.isInstalled = isInstalled;
	}

	/**
	 * Create a string representation of the game
	 * @returns {string} - A string representing the game
	 */
	toString() {
		return `${this.name} - ${this.source} - ${this.appId}`;
	}
}

module.exports = {
	SteamGame
};