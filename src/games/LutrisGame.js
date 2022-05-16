const { Game } = require("./Game.js");

/**
 * A class representing a Lutris game
 * @property {string} gameSlug - A lutris game slug
 * @property {string} configPath - The game's config path
 * @property {boolean} isInstalled - Whether the game is installed or not
 * @property {LutrisGameProcessContainer} processContainer - The game's process container
 */
class LutrisGame extends Game {

	platform = "PC";

	/**
	 * Create a lutris game
	 * @param {string} gameSlug - A lutris game slug
	 * @param {string} name - The game's displayed name
	 * @param {string} configPath - The games's config path
	 * @param {boolean} isInstalled - Whether the game is installed or not
	 */
	constructor(gameSlug, name, configPath, isInstalled) {
		super(name);
		this.gameSlug = gameSlug;
		this.configPath = configPath;
		this.isInstalled = isInstalled;
	}

	/**
	 * Create a string representation of the game
	 * @returns {string} - A string representing the game
	 */
	toString() {
		return `${this.name} - ${this.gameSlug}`;
	}

}

module.exports = {
	LutrisGame
};