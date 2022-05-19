const fsp = require("fs/promises");

const Source = require("./Source.js");
const HeroicGame = require("../games/HeroicGame");

const USER_DIR = process.env["HOME"];

class HeroicSource extends Source {

	static name = "Heroic";
	static gameClass = HeroicGame;

	preferCache = false;

	configPath = `${USER_DIR}/.config/heroic/store/library.json`;

	constructor(preferCache = false) {
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get all heroic launcher games
	 * @returns {HeroicGame[]} - An array of found games
	 * @todo support non installed games
	 */
	async scan() {

		// Read library.json file
		let library = await fsp.readFile(this.configPath, "utf-8");
		library = JSON.parse(library).library;

		// Build games
		const games = [];
		for (const entry of library) {
			if (entry?.["is_game"]) {
				const game = new this.constructor.gameClass(entry.title, entry.app_name);
				game.isInstalled = entry?.is_installed;
				games.push(game);
			}
		}
		return games;

	}

}

module.exports = HeroicSource;