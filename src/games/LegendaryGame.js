const { Game } = require("./Game.js");
const { LegendaryProcess } = require("../process/LegendaryProcess.js");

class LegendaryGame extends Game {

	static processClass = LegendaryProcess;

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
}

module.exports = {
	LegendaryGame
};