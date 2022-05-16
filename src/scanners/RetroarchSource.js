const fsp = require("fs/promises");
const path = require("path");
const fs = require("fs");

const Source = require("./Source.js");
const RetroarchGame = require("../games/RetroarchGame");

const USER_DIR = process.env["HOME"];

class RetroarchSource extends Source {

	static name = "Retroarch";
	static gameClass = RetroarchGame;

	preferCache = false;

	configPath = `${USER_DIR}/.config/retroarch/playlists`;

	constructor(preferCache = false) {
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get the paths to retroarch playlists.
	 * Found in $HOME/.config/retroarch/playlists
	 * @returns {string[]} - An array of playlist paths
	 * @private
	 */
	async _getPlaylistPaths() {

		let playlists = await fsp.readdir(this.configPath, { encoding: "utf-8", withFileTypes: true });
		playlists = playlists.filter(dirent=>dirent.isFile() && dirent.name.endsWith(".lpl"));
		playlists = playlists.map(dirent=>`${this.configPath}/${dirent.name}`);
		return playlists;

	}

	/**
	 * Get retroarch games from a playlist path.
	 * @param {string} playlistPath - Path to the playlist file to read from
	 * @returns {RetroarchGame[]} - An array of found games.
	 * @private
	 */
	async _getGamesFromPlaylist(playlistPath) {

		// Read the playlist file (it's JSON)
		const fileContents = await fsp.readFile(playlistPath, "utf-8");
		const playlist = JSON.parse(fileContents);

		// Get playlist console and default playlist core
		const PLAYLIST_DEFAULT_CORE_PATH = playlist.default_core_path;
		const PLAYLIST_PLATFORM = path.basename(playlistPath, ".lpl");

		// Build games from the given entries
		const games = [];
		for (const entry of playlist.items) {

			const gamePath = entry.path;
			if (!gamePath) {
				continue;
			}

			const gameIsInstalled = fs.existsSync(gamePath);
			let gameName = entry.label;
			let gameCorePath = entry.corePath;

			// Validate game data
			if (!gameName) {
				gameName = path.basename(gamePath);
			}
			if (!gameCorePath || gameCorePath === "DETECT") {
				gameCorePath = PLAYLIST_DEFAULT_CORE_PATH;
			}
			const game = new this.constructor.gameClass(
				gameName,
				gamePath,
				gameCorePath,
				PLAYLIST_PLATFORM,
				gameIsInstalled
			);
			if (game.name && game.path && game.corePath && game.platform) {
				games.push(game);
			} else {
				// Debug info
				// console.log(game.name, game.path, game.corePath, game.platform);
			}

		}
		return games;

	}

	/**
	 * Get all retroarch games
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {RetroarchGame[]} - An array of found games
	 */
	async scan(warn = false) {


		// Get retroarch playlists
		let playlistPaths = [];
		try {
			playlistPaths = await this._getPlaylistPaths();
		} catch (error) {
			if (warn){
				console.warn(`Unable to get retroarch playlists : ${error}`);
			}
		}


		// Read playlists
		const games = [];
		for (const playlistPath of playlistPaths) {
			let playlistGames;
			try {
				playlistGames = await this._getGamesFromPlaylist(playlistPath);
			} catch (error) {
				if (warn){
					console.warn(`Unable to get retroarch games from ${playlistPath} : ${error}`);
				}
				playlistGames = undefined;
			}
			if (playlistGames) {
				games.push(...playlistGames);
			}
		}

		return games;

	}

}

module.exports = RetroarchSource;