const deepReaddir = require("../utils/deepReaddir.js");
const common      = require("./common.js");

/**
 * Class representing an emulated game.
 * You're not supposed to use it directly, instead use a descendent of this class.
 * @property {string} path - The game's path to be started with an emulator
 * @abstract
 */
class EmulationGame extends common.Game{
	/**
	 * Create an emulated game
	 * @param {string} name - The game's displayed name
	 * @param {string} gamePath - The game's path
	 */
	constructor(name, gamePath){
		super(name);
		this.path = gamePath;
	}

	/**
	 * Get a string representing the game
	 * @returns {string} - A string representing the game
	 */
	toString(){
		return `${this.name} - ${this.source} (${this.platform})`;
	}
}

/**
 * Class representing an emulated games source.
 * You're not supposed to use it directly, instead use a descendent of this class.
 * @abstract
 */
class EmulationSource extends common.Source{

	/**
	 * Get the ROMs (emulation games) inside of some game dirs
	 * @param {GameDir} dirs - The game dirs to scan
	 * @param {RegExp} filesRegex - The regular expression to match rom files against
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {string[]} - A list of path to game ROMs
	 * @access protected
	 */
	async _getROMs(dirs, filesRegex, warn = false){
		const paths = [];
		// Get roms
		for (const dir of dirs){
			// Get all the files in dir recursively
			let filePaths;
			try {
				filePaths = await deepReaddir(
					dir.path,
					Infinity,
					(p)=>filesRegex.test(p)
				);
			} catch (error){
				if (warn) console.warn(`Skipping directory ${dir.path} (${error})`);
				continue;
			}
			// Add games
			paths.push(...filePaths);
		}
		return paths;
	}

}

module.exports = {
	EmulationSource,
	EmulationGame,
};