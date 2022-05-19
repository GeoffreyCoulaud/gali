/**
 * A class representing a source of games.
 * This is not supposed to be used directly, use one of the derived classes.
 * @property {boolean} preferCache - Whether the source should prefer cached options when scanning
 * @abstract
 */
class Source {

	static name = undefined;
	static gameClass = undefined;
	static gameDependency = null;

	preferCache = false;

	/**
	 * Scan for games of this class.
	 * @param {boolean} warn - Whether to display additional warnings
	 * @throws {Error} - If an error happens during the scan
	 * @returns {Game[]} - An array of found games
	 * @virtual
	 * @async
	 */
	async scan(warn = false) { }

}

module.exports = Source;