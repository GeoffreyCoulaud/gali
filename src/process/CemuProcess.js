const fsp = require("fs/promises");

const { linuxToWine } = require("../utils/convertPathPlatform.js");
const LutrisProcess = require("../process/LutrisProcess.js");

const Process = require("./Process.js");

/**
 * Sanitize a string to be used in a filename
 * @param {string} str - The string to sanitize
 * @returns {string} - A string suitable for safe and clean filenames
 */
function sanitizeStringFilename(str){
	return String(str).toLowerCase().replaceAll(/[^a-z0-9_-]/g, "-");
}

/**
 * A wrapper for cemu game process management
 */
class CemuProcess extends Process {

	command = "sh";

	constructor(game) {
		super();
		this.game = game;
	}

	/**
	 * Get a start shell script for a cemu game
	 * @returns {string} - An absolute path to the script
	 */
	async getStartScript () {

		// Create the base lutris start script for cemu
		const safeName = sanitizeStringFilename(this.game.name);
		scriptBaseName = `lutris-cemu-${safeName}.sh`;
		const scriptPath = await LutrisProcess.getStartScript("cemu", scriptBaseName);

		// Add the game path argument
		const winePath = linuxToWine(path);
		const fileContents = await fsp.readFile(scriptPath, "utf-8");
		let newFileContents = fileContents.trimEnd();
		newFileContents += ` --game "${winePath}"`;
		await fsp.writeFile(scriptPath, newFileContents, "utf-8");

		return scriptPath;

	}

	async start() {
		const scriptPath = this.getStartScript("cemu", this.path, cemuGameSlug);
		this.args[0] = scriptPath;
		await super.start();
	}

}

module.exports = CemuProcess;