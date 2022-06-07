const child_process = require("child_process");

const Process = require("./Process.js");

/**
 * A wrapper for ppsspp game process management
 * @property {string} romPath - The game's ROM path, used to invoke ppsspp
 */
class PPSSPPProcess extends Process {

	command = "PPSSPPSDL";

	constructor (game) {
		super();
		this.args.push(game.romPath);
	}

}

module.exports = PPSSPPProcess;