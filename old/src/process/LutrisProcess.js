const getLutrisStartScript = require("../utils/getLutrisStartScript.js");

const Process = require("./Process.js");

/**
 * A wrapper for lutris game process management
 * @property {string} gameSlug - A lutris game slug, used to invoke lutris
 */
class LutrisProcess extends Process {

	command = "sh";

	constructor (game) {
		super();
		this.game = game;
	}

	/**
	 * Get a start shell script for a lutris game
	 * @returns {string} - An absolute path to the script
	 */
	async getStartScript() {
		return await getLutrisStartScript(this.game.gameSlug);
	}

	// ? Maybe we need a cleaner way to prepare before starting...
	async start() {
		const scriptPath = await this.getStartScript();
		this.args[0] = scriptPath; // Replace the script path
		await super.start();
	}

}

module.exports = LutrisProcess;