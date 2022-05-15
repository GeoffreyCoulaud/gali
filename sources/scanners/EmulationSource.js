const deepReaddir = require("../utils/deepReaddir.js");
const { Source } = require("./Source.js");

/**
 * Class representing an emulated games source.
 * You're not supposed to use it directly, instead use a descendent of this class.
 * @abstract
 */
class EmulationSource extends Source {

	/**
	 * Get the ROMs (emulation games) inside of some game dirs
	 * @param {GameDir} dirs - The game dirs to scan
	 * @param {RegExp} filesRegex - The regular expression to match rom files against
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {string[]} - A list of path to game ROMs
	 * @access protected
	 */
	async _getROMs(dirs, filesRegex, warn = false) {
		const paths = [];
		// Get roms
		for (const dir of dirs) {
			// Get all the files in dir recursively
			let filePaths;
			try {
				filePaths = await deepReaddir(
					dir.path,
					Infinity,
					(p)=>filesRegex.test(p)
				);
			} catch (error) {
				if (warn){
					console.warn(`Skipping directory ${dir.path} (${error})`);
				}
				continue;
			}
			// Add games
			paths.push(...filePaths);
		}
		return paths;
	}

}

module.exports = {
	EmulationSource
};