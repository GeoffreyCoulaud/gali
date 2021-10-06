const { EmulatedGame, GameProcessContainer, Source } = require("./common.js");
const { join: pathJoin, basename: pathBasename} = require("path");
const { readFile, readdir } = require("fs/promises");
const { spawn } = require("child_process");
const { env } = require("process");

/**
 * A wrapper for retroarch game process management
 * @property {string} romPath - The game's ROM path, used to invoke retroarch
 * @property {string} corePath - The games's libretro core path, used to invoke retroarch
 */
class RetroarchGameProcessContainer extends GameProcessContainer{

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
		const command = this._selectCommand();
		this.process = spawn(
			command,
			["--libretro", this.corePath, this.romPath],
			GameProcessContainer.defaultSpawnOptions
		);
		this._bindProcessEvents();
	}
}

/**
 * A class representing a retroarch game
 * @property {string} corePath - The game's libretro core path
 * @property {RetroarchGameProcessContainer} processContainer - The game's process container
 */
class RetroarchGame extends EmulatedGame{

	source = RetroarchSource.name;

	/**
	 * Create a retroarch game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The game's ROM path
	 * @param {string} corePath - The game's libretro core path
	 * @param {string} platform - The game's original platform
	 */
	constructor(name, path, corePath, platform){
		super(name, path);
		this.platform = platform;
		this.corePath = corePath;
		this.processContainer = new RetroarchGameProcessContainer(this.path, this.corePath);
	}

}

class RetroarchSource extends Source{

	static name = "Retroarch";
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

		const USER_DIR = env["HOME"];
		const PLAYLISTS_PATH = pathJoin(USER_DIR, ".config/retroarch/playlists");
		let playlists = await readdir(PLAYLISTS_PATH, {encoding: "utf-8", withFileTypes: true});
		playlists = playlists.filter(dirent=>dirent.isFile() && dirent.name.endsWith(".lpl"));
		playlists = playlists.map(dirent=>pathJoin(PLAYLISTS_PATH, dirent.name));
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
		const fileContents = await readFile(playlistPath, "utf-8");
		const playlist = JSON.parse(fileContents);

		// Get playlist console and default playlist core
		const PLAYLIST_DEFAULT_CORE_PATH = playlist.default_core_path;
		const PLAYLIST_PLATFORM = pathBasename(playlistPath, ".lpl");

		// Build games from the given entries
		const games = [];
		for (const entry of playlist.items){

			const gamePath = entry.path;
			let gameName = entry.label;
			let gameCorePath = entry.corePath;

			// Validate game data
			if (!gamePath){
				continue;
			}
			if (!gameName){
				gameName = pathBasename(gamePath);
			}
			if (!gameCorePath || gameCorePath === "DETECT"){
				gameCorePath = PLAYLIST_DEFAULT_CORE_PATH;
			}
			const game = new RetroarchGame(gameName, gamePath, gameCorePath, PLAYLIST_PLATFORM);
			if (game.name && game.path && game.corePath && game.platform){
				games.push(game);
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