const { Game } = require("./Game.js");

/**
 * Class representing an emulated game.
 * You're not supposed to use it directly, instead use a descendent of this class.
 * @property {string} path - The game's path to be started with an emulator
 * @abstract
 */
class EmulationGame extends Game {
	/**
	 * Create an emulated game
	 * @param {string} name - The game's displayed name
	 * @param {string} gamePath - The game's path
	 */
	constructor(name, gamePath) {
		super(name);
		this.path = gamePath;
	}

	/**
	 * Get a string representing the game
	 * @returns {string} - A string representing the game
	 */
	toString() {
		return `${this.name} - ${this.source} (${this.platform})`;
	}
}

module.exports = {
	EmulationGame
};