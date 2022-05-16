const { Game } = require("./Game.js");
const { LutrisProcess } = require("../process/LutrisProcess.js");

class LutrisGame extends Game {

	static processClass = LutrisProcess;
	
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
}

module.exports = {
	LutrisGame
};