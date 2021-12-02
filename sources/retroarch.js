const emulation     = require("./emulation.js");
const common        = require("./common.js");
const child_process = require("child_process");
const fsp           = require("fs/promises");
const process       = require("process");
const path          = require("path");
const fs            = require("fs");

const RETROARCH_SOURCE_NAME = "Retroarch";

const USER_DIR = process.env["HOME"];
const PLAYLISTS_PATH = `${USER_DIR}/.config/retroarch/playlists`;

/**
 * A wrapper for retroarch game process management
 * @property {string} romPath - The game's ROM path, used to invoke retroarch
 * @property {string} corePath - The games's libretro core path, used to invoke retroarch
 */
class RetroarchGameProcessContainer extends common.GameProcessContainer{

	commandOptions = ["retroarch"];

	/**
	 * Create a retroarch game process container
	 * @param {string} romPath The game's ROM path
	 * @param {string} corePath The game's libretro core path
	 */
	constructor(romPath, corePath){
		super();
		this.romPath = romPath;
		this.corePath = corePath;
	}

	/**
	 * Start the game in a subprocess
	 */
	async start(){
		const command = await this._selectCommand();
		this.process = child_process.spawn(
			command,
			["--libretro", this.corePath, this.romPath],
			common.GameProcessContainer.defaultSpawnOptions
		);
		this._bindProcessEvents();
		return;
	}
}

/**
 * A class representing a retroarch game
 * @property {string} corePath - The game's libretro core path
 * @property {RetroarchGameProcessContainer} processContainer - The game's process container
 */
class RetroarchGame extends emulation.EmulationGame{

	source = RETROARCH_SOURCE_NAME;

	/**
	 * Create a retroarch game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The game's ROM path
	 * @param {string} corePath - The game's libretro core path
	 * @param {string} platform - The game's original platform
	 * @param {boolean} isInstalled - Whether the game is installed (found on disk)
	 */
	constructor(name, path, corePath, platform, isInstalled = false){
		super(name, path);
		this.platform = platform;
		this.corePath = corePath;
		this.isInstalled = isInstalled;
		this.processContainer = new RetroarchGameProcessContainer(this.path, this.corePath);
	}

}

class RetroarchSource extends common.Source{

	static name = RETROARCH_SOURCE_NAME;
	preferCache = false;

	constructor(preferCache = false){
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get the paths to retroarch playlists.
	 * Found in $HOME/.config/retroarch/playlists
	 * @returns {string[]} - An array of playlist paths
	 * @private
	 */
	async _getPlaylistPaths(){

		let playlists = await fsp.readdir(PLAYLISTS_PATH, {encoding: "utf-8", withFileTypes: true});
		playlists = playlists.filter(dirent=>dirent.isFile() && dirent.name.endsWith(".lpl"));
		playlists = playlists.map(dirent=>`${PLAYLISTS_PATH}/${dirent.name}`);
		return playlists;

	}

	/**
	 * Get retroarch games from a playlist path.
	 * @param {string} playlistPath - Path to the playlist file to read from
	 * @returns {RetroarchGame[]} - An array of found games.
	 * @private
	 */
	async _getGamesFromPlaylist(playlistPath){

		// Read the playlist file (it's JSON)
		const fileContents = await fsp.readFile(playlistPath, "utf-8");
		const playlist = JSON.parse(fileContents);

		// Get playlist console and default playlist core
		const PLAYLIST_DEFAULT_CORE_PATH = playlist.default_core_path;
		const PLAYLIST_PLATFORM = path.basename(playlistPath, ".lpl");

		// Build games from the given entries
		const games = [];
		for (const entry of playlist.items){

			const gamePath = entry.path;
			if (!gamePath){
				continue;
			}

			const gameIsInstalled = fs.existsSync(gamePath);
			let gameName = entry.label;
			let gameCorePath = entry.corePath;

			// Validate game data
			if (!gameName){
				gameName = path.basename(gamePath);
			}
			if (!gameCorePath || gameCorePath === "DETECT"){
				gameCorePath = PLAYLIST_DEFAULT_CORE_PATH;
			}
			const game = new RetroarchGame(
				gameName,
				gamePath,
				gameCorePath,
				PLAYLIST_PLATFORM,
				gameIsInstalled
			);
			if (game.name && game.path && game.corePath && game.platform){
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
	async scan(warn = false){


		// Get retroarch playlists
		let playlistPaths = [];
		try {
			playlistPaths = await this._getPlaylistPaths();
		} catch (error){
			if (warn) console.warn(`Unable to get retroarch playlists : ${error}`);
		}


		// Read playlists
		const games = [];
		for (const playlistPath of playlistPaths){
			let playlistGames;
			try {
				playlistGames = await this._getGamesFromPlaylist(playlistPath);
			} catch (error) {
				if (warn) console.warn(`Unable to get retroarch games from ${playlistPath} : ${error}`);
				playlistGames = undefined;
			}
			if (playlistGames){
				games.push(...playlistGames);
			}
		}

		return games;

	}

}

module.exports = {
	RetroarchGameProcessContainer,
	RetroarchSource,
	RetroarchGame,
};