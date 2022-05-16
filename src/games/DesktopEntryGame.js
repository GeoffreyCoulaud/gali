const { Game } = require("./Game.js");
const { DesktopEntryProcess } = require("../process/DesktopEntryProcess.js");

class DesktopEntryGame extends Game {

	static processClass = DesktopEntryProcess;

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