const fsp = require("fs/promises");
const fs = require("fs");

const deepReaddir = require("../utils/deepReaddir.js");

const Source = require("./Source.js");

/**
 * Class representing an emulated games source.
 * You're not supposed to use it directly, instead use a descendent of this class.
 * @abstract
 */
class EmulationSource extends Source {

	static gameClass = undefined;

	/**
	 * Get the ROMs (emulation games) inside of some game dirs
	 * @param {GameDir} dirs - The game dirs to scan
	 * @param {RegExp} filesRegex - The regular expression to match rom files against
	 * @returns {string[]} - A list of path to game ROMs
	 * @access protected
	 */
	async _getROMs(dirs, filesRegex) {
		const paths = [];
		for (const dir of dirs) {
			try { await fsp.access(dir.path, fs.constants.R_OK); } 
			catch (err) { continue; }
			const depth = dir.recursive ? Infinity : 0; 
			const found = await deepReaddir(dir.path, depth, (p)=>filesRegex.test(p));
			paths.push(...found);
		}
		return paths;
	}

}

module.exports = EmulationSource;