const { WiiUEmulationGame } = require("./WiiUEmulationGame.js");

/**
 * Sanitize a string to be used in a filename
 * @param {string} str - The string to sanitize
 * @returns {string} - A string suitable for safe and clean filenames
 */
function sanitizeStringFilename(str){
	return String(str).toLowerCase().replaceAll(/[^a-z0-9_-]/g, "-");
}
exports.sanitizeStringFilename = sanitizeStringFilename;

/**
 * A class representing a cemu (in lutris) game
 */
class CemuGame extends WiiUEmulationGame{
	constructor(name, path){
		super(name, path);
	}

	/**
	 * Create a string representation of the game
	 * @returns {string} - A string representing the game
	 */
	toString(){
		return this.name;
	}

}

module.exports = {
	sanitizeStringFilename,
	CemuGame
};