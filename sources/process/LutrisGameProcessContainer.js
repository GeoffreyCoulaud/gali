const ad = require("../utils/appDirectories.js");
const commandExists = require("../utils/commandExists.js");
const { GameProcessContainer } = require("./GameProcessContainer.js");
const { NoCommandError } = require("./NoCommandError.js");
const child_process = require("child_process");

/**
 * A promise version of the child_process execFile
 */
function execFilePromise(command, args = [], options = {}){
	return new Promise((resolve, reject)=>{
		child_process.execFile(command, args, options, (error, stdout, stderr)=>{
			if (error) reject(error);
			else resolve(stdout, stderr);
		});
	});
}

/**
 * A wrapper for lutris game process management
 * @property {string} gameSlug - A lutris game slug, used to invoke lutris
 */
class LutrisGameProcessContainer extends GameProcessContainer {

	commandOptions = ["sh", "zsh", "bash"];

	/**
	 * Create a lutris game process container
	 * @param {string} gameSlug - A lutris game slug
	 */
	constructor(gameSlug) {
		super();
		this.gameSlug = gameSlug;
	}

	/**
	* Get a start script for a lutris game
	* @param {string} gameSlug - The lutris game's slug for which to get a start script
	* @param {string} scriptBaseName - Name (with extension) for the output script file
	* @returns {string} - An absolute path to the script
	*/
	static async getStartScript(gameSlug, scriptBaseName = "") {

		// Get the start script from lutris
		const lutrisCommand = "lutris";
		const doesCommandExist = await commandExists(lutrisCommand);
		if (!doesCommandExist) {
			throw new NoCommandError("No lutris command found");
		}

		// Store the script
		if (!scriptBaseName){
			scriptBaseName = `lutris-${gameSlug}.sh`;
		}
		const scriptPath = `${ad.BRAG_START_SCRIPTS_DIR}/${scriptBaseName}`;
		await execFilePromise(lutrisCommand, [gameSlug, "--output-script", scriptPath]);

		return scriptPath;

	}

	/**
	 * Start the game in a subprocess
	 */
	async start() {
		const scriptPath = await this.constructor.getStartScript(this.gameSlug);
		const command = await this._selectCommand();
		this.process = child_process.spawn(
			command,
			[scriptPath],
			this.constructor.defaultSpawnOptions
		);
		this._bindProcessEvents();
		return;
	}

}

module.exports = {
	LutrisGameProcessContainer
};