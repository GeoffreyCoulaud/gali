const dirs          = require("../utils/directories.js");
const common        = require("./common.js");
const commandExists = require("command-exists"); // ? reimplement
const child_process = require("child_process");
const process       = require("process");
const sqlite3       = require("sqlite3");
const sqlite        = require("sqlite");
const fs            = require("fs");

const USER_DIR = process.env["HOME"];
const LUTRIS_DB_PATH = `${USER_DIR}/.local/share/lutris/pga.db`;
const LUTRIS_BANNER_PATH = `${USER_DIR}/.local/share/lutris/banners`;
const LUTRIS_ICON_PATH = `${USER_DIR}/.local/share/icons/hicolor/128x128/apps`;

const LUTRIS_SOURCE_NAME = "Lutris";

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
class LutrisGameProcessContainer extends common.GameProcessContainer{

	commandOptions = ["sh", "zsh", "bash"];

	/**
	 * Create a lutris game process container
	 * @param {string} gameSlug - A lutris game slug
	 */
	constructor(gameSlug){
		super();
		this.gameSlug = gameSlug;
	}

	/**
	* Get a start script for a lutris game
	* @param {string} gameSlug - The lutris game's slug for which to get a start script
	* @param {string} scriptBaseName - Name (with extension) for the output script file
	* @returns {string} - An absolute path to the script
	*/
	static async getStartScript(gameSlug, scriptBaseName = ""){

		// Get the start script from lutris
		const lutrisCommand = "lutris";
		if (!commandExists.sync(lutrisCommand)){
			throw new common.NoCommandError("No lutris command found");
		}

		// Store the script
		if (!scriptBaseName) scriptBaseName = `lutris-${gameSlug}.sh`;
		const scriptPath = `${dirs.bragUserLocalData}/start-scripts/${scriptBaseName}`;
		await execFilePromise(lutrisCommand, [gameSlug, "--output-script", scriptPath]);

		return scriptPath;

	}

	/**
	 * Start the game in a subprocess
	 */
	async start(){
		const scriptPath = await this.constructor.getStartScript(this.gameSlug);
		const command = this._selectCommand();
		this.process = child_process.spawn(
			command,
			[scriptPath],
			this.constructor.defaultSpawnOptions
		);
		this._bindProcessEvents();
		return;
	}

}

/**
 * A class representing a Lutris game
 * @property {string} gameSlug - A lutris game slug
 * @property {string} configPath - The game's config path
 * @property {boolean} isInstalled - Whether the game is installed or not
 * @property {LutrisGameProcessContainer} processContainer - The game's process container
 */
class LutrisGame extends common.Game{

	platform = "PC";
	source = LUTRIS_SOURCE_NAME;

	/**
	 * Create a lutris game
	 * @param {string} gameSlug - A lutris game slug
	 * @param {string} name - The game's displayed name
	 * @param {string} configPath - The games's config path
	 * @param {boolean} isInstalled - Whether the game is installed or not
	 */
	constructor(gameSlug, name, configPath, isInstalled){
		super(name);
		this.gameSlug = gameSlug;
		this.configPath = configPath;
		this.isInstalled = isInstalled;
		this.processContainer = new LutrisGameProcessContainer(this.gameSlug);
	}

	/**
	 * Create a string representation of the game
	 * @returns {string} - A string representing the game
	 */
	toString(){
		return `${this.name} - ${this.source} - ${this.gameSlug}`;
	}

}

/**
 * A class representing a Lutris source
 */
class LutrisSource extends common.Source{

	static name = LUTRIS_SOURCE_NAME;
	preferCache = false;

	constructor(preferCache = false){
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Optional step, add images to a game
	 * @param {LutrisGame} game - The game to get image for
	 */
	_getGameImages(game){
		const images = {
			coverImage: `${LUTRIS_BANNER_PATH}/${game.gameSlug}.jpg`,
			iconImage: `${LUTRIS_ICON_PATH}/lutris_${game.gameSlug}.png`,
		};
		for (const [key, value] of Object.entries(images)){
			const imageExists = fs.existsSync(value);
			if (imageExists){
				game[key] = value;
			}
		}
	}

	/**
	 * Get all lutris games
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {LutrisGame[]} - A list of found games
	 */
	async scan(warn = false){
		const games = [];

		// Open DB
		let db;
		try {
			db = await sqlite.open({filename: LUTRIS_DB_PATH, driver: sqlite3.cached.Database});
		} catch(error){
			if (warn) console.warn(`Could not open lutris DB (${error})`);
			return games;
		}

		// Get games
		const DB_REQUEST = "SELECT name, slug, configpath, installed FROM 'games' WHERE NOT hidden";
		const results = await db.all(DB_REQUEST);
		for (const row of results){
			if (row.slug && row.name && row.configpath){
				const game = new LutrisGame(
					row.slug,
					row.name,
					row.configpath,
					row.installed
				);
				this._getGameImages(game);
				games.push(game);
			}
		}

		return games;
	}

}

module.exports = {
	LutrisGameProcessContainer,
	LutrisSource,
	LutrisGame,
};