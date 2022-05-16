const { Game } = require("./Game.js");

/**
 * A class representing a legendary games launcher game
 * @property {string} appName - The game's epic games launcher app name
 * @property {LegendaryGameProcessContainer} processContainer - The game's process container
 */
class LegendaryGame extends Game {

	platform = "PC";
	isInstalled = true; // Legendary only exposes installed games

	/**
	 * Create a legendary games launcher game
	 * @param {string} appName - The game's app name
	 * @param {string} name  - The game's displayed name
	 */
	constructor(appName, name) {
		super(name);
		this.appName = appName;
	}

	/**
	 * Create a string representation of the game
	 * @returns {string} - A string representing the game
	 */
	toString() {
		return `${this.name} - ${this.source} - ${this.appName}`;
	}

}

module.exports = {
	LegendaryGame
};