const convertPath = require("../../utils/convertPathPlatform.js");
const { GameProcessContainer } = require("./GameProcessContainer.js");
const lutris = require("../games/lutris.js");
const child_process = require("child_process");
const fsp = require("fs/promises");
const { sanitizeStringFilename } = require("../games/CemuGame");

/**
 * A wrapper for cemu game process management
 */
class CemuGameProcessContainer extends GameProcessContainer {

	commandOptions = ["sh", "zsh", "bash"];

	/**
	 * Create a cemu game process container
	 * @param {string} name - The game's displayed name
	 * @param {string} path - A wine path to the game file
	 */
	constructor(name, path) {
		super();
		this.name = name;
		this.path = path;
	}

	/**
	 * Get a start shell script for a cemu game
	 * @param {string} name - The game's name
	 * @param {string} path - The game's ROM path
	 * @param {string} cemuGameSlug - The lutris game slug for cemu
	 * @param {string} scriptBaseName - Name (with extension) for the output script file
	 * @returns {string} - An absolute path to the script
	 */
	static async getStartScript(name, path, cemuGameSlug = "cemu", scriptBaseName = "") {

		// Create the base lutris start script for cemu
		if (!scriptBaseName) {
			const safeSlug = sanitizeStringFilename(cemuGameSlug);
			const safeName = sanitizeStringFilename(name);
			scriptBaseName = `lutris-${safeSlug}-${safeName}.sh`;
		}
		const scriptPath = await lutris.LutrisGameProcessContainer.getStartScript(cemuGameSlug, scriptBaseName);

		// Add the game path argument
		const winePath = convertPath.linuxToWine(path);
		const fileContents = await fsp.readFile(scriptPath, "utf-8");
		let newFileContents = fileContents.trimEnd();
		newFileContents += ` --game "${winePath}"`;
		await fsp.writeFile(scriptPath, newFileContents, "utf-8");

		return scriptPath;

	}

	/**
	 * Start the game in a sub process.
	 * @param {string} cemuGameSlug - Optional, a specific lutris game slug for cemu.
	 */
	async start(cemuGameSlug = "cemu") {
		const command = await this._selectCommand();
		const scriptPath = await this.constructor.getStartScript(this.name, this.path, cemuGameSlug);
		this.process = child_process.spawn(
			command,
			[scriptPath],
			this.constructor.defaultSpawnOptions
		);
		this._bindProcessEvents();
	}

}

module.exports = {
	CemuGameProcessContainer
};