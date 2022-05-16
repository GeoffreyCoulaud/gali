/**
 * Class representing a generic game.
 * You're not supposed to use it directly, instead use a descendent of this class.
 *
 * @property {string} source - The games's provenance in the system
 * @property {string} name - The game's displayed (localized) name
 * @property {string} platform - The game's original platform
 * @property {undefined|boolean} isInstalled - Whether the game is currently installed or not.
 *                                             Undefined if this is not implemented for the current source.
 * @property {string} boxArtImage - URI to the game's box art
 * @property {string} coverImage - URI to the game's cover
 * @property {string} iconImage - URI to the game's icon
 *
 * @abstract
 */
class Game {

	static processClass = undefined;

	// Game metadata props
	name = undefined;
	platform = undefined;
	isInstalled = undefined;

	// Images props
	boxArtImage = undefined;
	coverImage = undefined;
	iconImage = undefined;

	/**
	 * Create a game
	 * @param {string} name - The game's display name
	 */
	constructor(name) {
		this.name = name;
	}

	toString(){
		return this.name;
	}
}

module.exports = {
	Game
};