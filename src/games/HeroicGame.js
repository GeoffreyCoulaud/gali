const { Game } = require("./Game.js");

/**
 * A class representing a Heroic launcher game
 */
class HeroicGame extends Game {

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