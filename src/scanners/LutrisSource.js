const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const fs = require("fs");

const { Source } = require("./Source.js");
const { LutrisGame } = require("../games/LutrisGame");

const USER_DIR = process.env["HOME"];

class LutrisSource extends Source {
	
	static name = "Lutris";
	static gameClass = LutrisGame;

	preferCache = false;
	
	dbPath = `${USER_DIR}/.local/share/lutris/pga.db`;
	bannerPath = `${USER_DIR}/.local/share/lutris/banners`;
	iconPath = `${USER_DIR}/.local/share/icons/hicolor/128x128/apps`;

	constructor(preferCache = false) {
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Optional step, add images to a game
	 * @param {LutrisGame} game - The game to get image for
	 */
	_getGameImages(game) {
		const images = {
			coverImage: `${this.bannerPath}/${game.gameSlug}.jpg`,
			iconImage: `${this.iconPath}/lutris_${game.gameSlug}.png`,
		};
		for (const [key, value] of Object.entries(images)) {
			const imageExists = fs.existsSync(value);
			if (imageExists) {
				game[key] = value;
			}
		}
	}

	/**
	 * Get all lutris games
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {LutrisGame[]} - A list of found games
	 */
	async scan(warn = false) {
		const games = [];

		// Open DB
		let db;
		try {
			db = await sqlite.open({ filename: this.dbPath, driver: sqlite3.cached.Database });
		} catch (error) {
			if (warn){
				console.warn(`Could not open lutris DB (${error})`);
			}
			return games;
		}

		// Get games
		const DB_REQUEST = "SELECT name, slug, configpath, installed FROM 'games' WHERE NOT hidden";
		const results = await db.all(DB_REQUEST);
		for (const row of results) {
			if (row.slug && row.name && row.configpath) {
				const game = new this.constructor.gameClass(
					row.slug,
					row.name,
					row.configpath,
					row.installed
				);
				this._getGameImages(game);
				games.push(game);
			}
		}

		return games;
	}

}

module.exports = {
	LutrisSource
};