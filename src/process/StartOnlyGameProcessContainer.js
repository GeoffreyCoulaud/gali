const { GameProcessContainer } = require("./GameProcessContainer.js");

/**
 * A GameProcessContainer that doesn't handle stop and kill actions
 * @abstract
 */
class StartOnlyGameProcessContainer extends GameProcessContainer {

	isStoppable = false;
	isKillable = false;

	/**
	 * Overwrite the inherited stop method to neutralize it
	 * @returns {boolean} - Always false
	 */
	stop() {
		console.warn(`${this.constructor.name} does not implement stopping`);
		return false;
	}

	/**
	 * Overwrite the inherited kill method to neutralize it
	 * @returns {boolean} - Always false
	 */
	kill() {
		console.warn(`${this.constructor.name} does not implement killing`);
		return false;
	}

}

module.exports = {
	StartOnlyGameProcessContainer
};