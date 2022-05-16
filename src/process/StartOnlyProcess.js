const Process = require("./Process.js");

/**
 * A Process that doesn't handle stop and kill actions
 * @abstract
 */
class StartOnlyProcess extends Process {

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

module.exports = StartOnlyProcess;