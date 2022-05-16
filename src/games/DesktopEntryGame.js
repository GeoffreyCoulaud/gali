const { Game } = require("./Game.js");

/**
 * A class representing a game found via its desktop entry
 */
class DesktopEntryGame extends Game {

	platform = "PC";
	isInstalled = true; // All desktop entries games are considered installed

	/**
	 * Create a desktop entry game
	 * @param {string} name - The game's displayed name
	 * @param {string} exec - The exec field of the game's desktop file
	 */
	constructor(name, exec) {
		super(name);
	}
}

module.exports = {
	DesktopEntryGame
};