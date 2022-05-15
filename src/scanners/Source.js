/**
 * A class representing a source of games.
 * This is not supposed to be used directly, use one of the derived classes.
 * @property {string} name - The displayed name for this source
 * @property {Class} gameClass - The class for games of this source
 * @property {boolean} preferCache - Whether the source should prefer cached options when scanning
 * @abstract
 */
class Source {

	gameClass = undefined;
	preferCache = false;
	name = undefined;

	/**
	 * Scan for games of this class.
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {Game[]} - An array of found games
	 * @virtual
	 * @async
	 */
	async scan(warn = false) { }

}

module.exports = {
	Source
};