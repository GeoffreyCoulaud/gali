const Process = require("./Process.js");

class YuzuProcess extends Process {

	command = "yuzu";

	constructor(game) {
		super();
		this.args.push(game.romPath);
	}

	/**
	 * Overwrite the inherited stop method to equal the inherited kill method.
	 * This is done because yuzu seems to trap SIGTERM and needs to get SIGKILL to terminate.
	 * @returns {boolean} - True on success, else false
	 */
	stop() {
		return this.kill();
	}
}

module.exports = YuzuProcess;