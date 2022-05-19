const fsp = require("fs/promises");

const Source = require("./Source.js");
const LegendaryGame = require("../games/LegendaryGame");

const USER_DIR = process.env["HOME"];

class LegendarySource extends Source {

	static name = "Legendary";
	static gameClass = LegendaryGame;

	preferCache = false;

	configPath = `${USER_DIR}/.config/legendary/installed.json`;

	constructor(preferCache = false) {
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get all legendary launcher games
	 * @returns {LegendaryGame[]} - An array of found games
	 * @todo support non installed games
	 */
	async scan() {

		// Read installed.json file
		let config = await fsp.readFile(this.configPath, "utf-8");
		config = JSON.parse(config);

		// Build games
		const games = [];
		for (const key of Object.keys(config)) {
			const { name, title } = config[key];
			if (!name || !title) continue;
			const game = new this.constructor.gameClass(name, title);
			games.push(game);
		}
		return games;

	}

}

module.exports = LegendarySource;