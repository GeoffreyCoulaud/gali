const { Game } = require("./Game.js");
const { HeroicProcess } = require("../process/HeroicProcess.js");

class HeroicGame extends Game {

	static processClass = HeroicProcess;

	platform = "PC";

	/**
	 * Create a Heroic Games Launcher game
	 * @param {string} name - The game's displayed name
	 * @param {string} appName - The game's epic store app_name
	 */
	constructor(name, appName) {
		super(name);
	}
}

module.exports = {
	HeroicGame
};