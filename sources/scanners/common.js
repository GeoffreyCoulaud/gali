const deepReaddir = require("../utils/deepReaddir.js");

class NotImplementedError extends Error{}

/**
 * Class representing a game directory
 */
class GameDir {
	/**
	 * Create a game directory
	 * @param {string} dirPath - The local path corresponding to the directory
	 * @param {boolean} recursive - Whether to search games into the directory subdirs
	 */
	constructor(dirPath, recursive = false) {
		this.path = dirPath;
		this.recursive = recursive;
	}
}

/**
 * Get the ROMs (emulation games) inside of some game dirs
 * @param {GameDir} dirs - The game dirs to scan
 * @param {RegExp} filesRegex - The regular expression to match rom files against
 * @param {boolean} warn - Whether to display additional warnings
 * @returns {string[]} - A list of path to game ROMs
 */
async function getROMs(dirs, filesRegex, warn = false){
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

module.exports = {
	NotImplementedError,
	NoCommandError,
	GameDir,
	getROMs,
};