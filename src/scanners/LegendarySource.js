const fsp = require("fs/promises");

const { Source } = require("./Source.js");
const { LegendaryGame } = require("../games/LegendaryGame");

const USER_DIR = process.env["HOME"];

class LegendarySource extends Source {
	
	static name = "Legendary";
	
	INSTALLED_FILE_PATH = `${USER_DIR}/.config/legendary/installed.json`;
	
	preferCache = false;

	constructor(preferCache = false) {
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get all legendary launcher games
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {LegendaryGame[]} - An array of found games
	 * @todo support non installed games
	 */
	async scan(warn = false) {

		// Read installed.json file
		let data;
		try {
			const fileContents = await fsp.readFile(this.INSTALLED_FILE_PATH, "utf-8");
			data = JSON.parse(fileContents);
		} catch (error) {
			if (warn){
				console.warn(`Unable to read legendary installed.json : ${error}`);
			}
			data = undefined;
		}

		// Build games
		const games = [];
		if (data) {
			for (const key of Object.keys(data)) {
				const gameData = data[key];
				const gameName = gameData?.app_name;
				const gameTitle = gameData?.title;
				if (gameName && gameTitle) {
					const game = new LegendaryGame(gameData?.app_name, gameData?.title);
					games.push(game);
				}
			}
		}

		return games;
	}

}

module.exports = {
	LegendarySource
};