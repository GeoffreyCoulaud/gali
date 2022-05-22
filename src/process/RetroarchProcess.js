const Process = require("./Process.js");

/**
 * A wrapper for retroarch game process management
 * @property {string} romPath - The game's ROM path, used to invoke retroarch
 * @property {string} corePath - The games's libretro core path, used to invoke retroarch
 */
class RetroarchProcess extends Process {

	command = "retroarch";

	constructor (game) {
		super();
		this.args.push("--libretro", game.corePath, game.romPath);
	}

}

module.exports = RetroarchProcess;