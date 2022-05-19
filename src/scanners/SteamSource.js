const fsp = require("fs/promises");
const vdfParser = require("vdf-parser");
const fs = require("fs");

const GameDir = require("./GameDir.js");

const Source = require("./Source.js");
const SteamGame = require("../games/SteamGame");

const USER_DIR = process.env["HOME"];

/**
 * Checks if a string matches any of the passed regular expressions
 * @param {string} str - The string to test
 * @param {RegExp} regexes - The regexes to test
 * @returns {boolean} - True on match, else false
 */
function strMatchAny(str, regexes){
	for (const regex of regexes){
		if (str.match(regex)){
			return true;
		}
	}
	return false;
}

class SteamSource extends Source {

	static name = "Steam";
	static gameClass = SteamGame;

	preferCache = false;

	imageCacheDir = `${USER_DIR}/.local/share/Steam/appcache/librarycache`;
	configPath = `${USER_DIR}/.local/share/Steam/config/libraryfolders.vdf`;

	constructor(preferCache = false) {
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get steam's config data about install dirs
	 * @returns {object} - Steam's config data (install dirs)
	 * @private
	 */
	async _getConfig() {

		const fileContents = await fsp.readFile(this.configPath, { encoding: "utf-8" });
		const config = vdfParser.parse(fileContents);

		// Validate
		if (typeof config.libraryfolders === "undefined") {
			throw "Invalid steam config : libraryfolders key undefined";
		}

		return config;

	}

	/**
	 * Get steam install dirs from its config data
	 * @param {object} config - Steam's config data
	 * @returns {GameDir[]} - The game dirs extracted from Steam's config
	 * @private
	 */
	async _getDirs(config) {
		const libraryfolders = config.libraryfolders;
		const keys = Object.keys(libraryfolders);
		const dirs = [];
		for (const key of keys) {
			const path = libraryfolders[key].path;
			const dir = new GameDir(path);
			dirs.push(dir);
		}
		return dirs;
	}

	/**
	 * Optional step, adding images to a game
	 * @param {SteamGame} game - The game to add images to
	 * @private
	 */
	_getGameImages(game) {
		const images = {
			boxArtImage: `${this.imageCacheDir}/${game.appId}_library_600x900.jpg`,
			coverImage: `${this.imageCacheDir}/${game.appId}_header.jpg`,
			iconImage: `${this.imageCacheDir}/${game.appId}_icon.jpg`,
		};
		for (const [key, value] of Object.entries(images)) {
			const imageExists = fs.existsSync(value);
			if (imageExists) {
				game[key] = value;
			}
		}
	}

	/**
	 * Optional step, adding the installed state to a game
	 * @param {Steamgame} game - The game to get the installed state
	 * @param {object} manifestData - The game's manifest
	 * @see https://github.com/lutris/lutris/blob/master/docs/steam.rst
	 * @private
	 */
	_getGameIsInstalled(game, manifestData) {
		const stateFlags = manifestData?.AppState?.StateFlags;
		if (typeof stateFlags !== "undefined") {
			const installedMask = 4;
			game.isInstalled = stateFlags & installedMask;
		}
	}

	/**
	 * Get all steam installed games
	 * @param {GameDir[]} dirs - The steam game dirs to scan for game manifests
	 * @returns {SteamGame[]} - An array of found games
	 * @private
	 */
	async _getInstalledGames(dirs) {

		const IGNORED_ENTRIES_APPIDS = [
			"221410",
			"228980",
			"1070560", // Steam Linux Runtime
		];
		const IGNORED_ENTRIES_REGEXES = [
			/^Steamworks.*/,
			/^(S|s)team ?(L|l)inux ?(R|r)untime.*/,
			/^Proton.*/
		];

		const games = [];

		for (const dir of dirs) {

			// Get all games manifests of dir
			const manDir = `${dir.path}/steamapps`;
			let entries = [];
			try { entries = await fsp.readdir(manDir); } catch (err) { continue; }
			const manifests = entries.filter(string=>string.startsWith("appmanifest_") && string.endsWith(".acf"));

			// Get info from manifests
			for (const manName of manifests) {

				const INSTALLED_MASK = 4;
				const manPath = `${manDir}/${manName}`;
				const manContent = await fsp.readFile(manPath, { encoding: "utf-8" });
				const manData = vdfParser.parse(manContent);
				const stateFlags = manData?.AppState?.StateFlags ?? 0;

				const appid = manData?.AppState?.appid;
				const name = manData?.AppState?.name;
				const isInstalled = stateFlags & INSTALLED_MASK;

				// Skip duplicate games, except if the installed state of the
				// existing duplicate is worse.
				const dupIndex = games.findIndex(g=>g.appId === appid);
				if (dupIndex !== -1) {
					const dupGame = games[dupIndex];
					const isDupWorse = !dupGame.isInstalled && isInstalled;
					if (isDupWorse) {
						games.splice(dupIndex, 1);
					} else {
						continue;
					}
				}

				// Skip explicitly excluded manifests
				if (!name ||
					!appid ||
					IGNORED_ENTRIES_APPIDS.includes(appid) ||
					strMatchAny(name, IGNORED_ENTRIES_REGEXES)) {
					continue;
				}

				// Build game
				const game = new this.constructor.gameClass(appid, name, isInstalled);
				this._getGameIsInstalled(game, manData);
				this._getGameImages(game);
				games.push(game);

			}
		}

		return games;
	}

	/**
	 * Get all steam games
	 * @returns {SteamGame[]} - An array of found games
	 * @todo add support for non installed games
	 */
	async scan() {
		const config = await this._getConfig();
		const dirs = await this._getDirs(config);
		const games = await this._getInstalledGames(dirs);
		return games;
	}

}

module.exports = SteamSource;