const { execFilePromise } = require("../utils/subprocess.js");
const ad = require("../utils/appDirectories.js");

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
	* Get a start script for a lutris game
	* @param {string} gameSlug - The lutris game's slug for which to get a start script
	* @param {string} scriptBaseName - Name (with extension) for the output script file
	* @returns {string} - An absolute path to the script
	*/
	static async getStartScript(gameSlug, scriptBaseName = "") {
		if (!scriptBaseName) scriptBaseName = `lutris-${gameSlug}.sh`;
		const scriptPath = `${ad.APP_START_SCRIPTS_DIR}/${scriptBaseName}`;
		await execFilePromise("lutris", [gameSlug, "--output-script", scriptPath]);
		return scriptPath;
	}

	// ? Maybe we need a cleaner way to prepare before starting...
	async start() {
		const scriptPath = await this.constructor.getStartScript(this.game.gameSlug);
		this.args[0] = scriptPath; // Replace the script path
		await super.start();
	}

}

module.exports = LutrisProcess;