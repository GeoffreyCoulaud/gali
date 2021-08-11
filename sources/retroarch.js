import { EmulatedGame, GameProcessContainer, NoCommandError } from "./common.js";
import { join as pathJoin, basename as pathBasename} from "path";
import { sync as commandExistsSync } from "command-exists";
import { spawn } from "child_process";
import { promises as fsp } from "fs";
import { env } from "process";

/**
 * A wrapper for retroarch game process management
 * @property {string} romPath - The game's ROM path, used to invoke retroarch
 * @property {string} corePath - The games's libretro core path, used to invoke retroarch 
 */
class RetroarchGameProcessContainer extends GameProcessContainer{
	
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
	start(){
		const retroarchCommand = "retroarch";
		if (!commandExistsSync(retroarchCommand)){
			throw new NoCommandError("No retroarch command found");
		}
		this.process = spawn(
			"retroarch", 
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
export class RetroarchGame extends EmulatedGame{
	
	/**
	 * Create a retroarch game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The game's ROM path
	 * @param {string} corePath - The game's libretro core path
	 * @param {string} console - The game's original console
	 */
	constructor(name, path, corePath, console){
		super(name, path, "Retroarch", console);
		this.corePath = corePath;
		this.processContainer = new RetroarchGameProcessContainer(this.path, this.corePath);
	}

}

/**
 * Get the paths to retroarch playlists.
 * Found in $HOME/.config/retroarch/playlists
 * @returns {string[]} - An array of playlist paths
 */
async function getRetroarchPlaylistPaths(){

	const USER_DIR = env["HOME"];
	const PLAYLISTS_PATH = pathJoin(USER_DIR, ".config/retroarch/playlists");
	let playlists = await fsp.readdir(PLAYLISTS_PATH, {encoding: "utf-8", withFileTypes: true});
	playlists = playlists.filter(dirent=>dirent.isFile() && dirent.name.endsWith("lpl"));
	playlists = playlists.map(dirent=>pathJoin(PLAYLISTS_PATH, dirent.name));
	return playlists;
}

/**
 * Get retroarch games from a playlist path.
 * @param {string} playlistPath - Path to the playlist file to read from 
 * @returns {RetroarchGame[]} - An array of found games.
 */
async function getRetroarchGamesFromPlaylist(playlistPath){

	// Read the playlist file (it's JSON)
	const fileContents = await fsp.readFile(playlistPath, "utf-8");
	const playlist = JSON.parse(fileContents);

	// Get playlist console and default playlist core
	const PLAYLIST_DEFAULT_CORE_PATH = playlist.default_core_path;
	const PLAYLIST_CONSOLE = pathBasename(playlistPath, ".lpl");

	// Build games from the given entries
	let games = [];
	for (let entry of playlist.items){
		
		let gameName = entry.label;
		let gameCorePath = entry.corePath;
		if (!gameName){
			gameName = pathBasename(entry.path);
		}
		if (!gameCorePath || gameCorePath === "DETECT"){
			gameCorePath = PLAYLIST_DEFAULT_CORE_PATH;
		} 
		const game = new RetroarchGame(gameName, entry.path, gameCorePath, PLAYLIST_CONSOLE);
		
		// Validate game data
		if (game.name && game.path && game.corePath && game.console){
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
export async function getRetroarchGames(warn = false){

	// Get retroarch playlists
	let playlistPaths = [];
	try {
		playlistPaths = await getRetroarchPlaylistPaths();
	} catch (error){
		if (warn) console.warn(`Unable to get retroarch playlists : ${error}`);
	}

	// Read playlists
	let games = [];
	for (let playlistPath of playlistPaths){
		let tempGames;
		try {
			tempGames = await getRetroarchGamesFromPlaylist(playlistPath);
		} catch (error) {
			if (warn) console.warn(`Unable to get retroarch games from ${playlistPath} : ${error}`);
			tempGames = undefined;
		}
		if (typeof tempGames !== "undefined"){
			games.push(...tempGames);
		}
	}
	
	return games;

}