import { join as pathJoin, basename as pathBasename, extname as pathExtname} from "path";
import { EmulatedGame, GameProcessContainer } from "./common.js";
import { spawn } from "child_process";
import { promises as fsp } from "fs";
import { env } from "process";

class RetroarchGameProcessContainer extends GameProcessContainer{
	constructor(romPath, corePath){
		super();
		this.romPath = romPath;
		this.corePath = corePath;
	}
	start(){
		this.process = spawn("retroarch", ["--verbose","--libretro", this.corePath, this.romPath], GameProcessContainer.defaultSpawnOptions);
		this._bindProcessEvents();
	}
}

export class RetroarchGame extends EmulatedGame{
	constructor(name, path, corePath, console){
		super(name, path, "Retroarch", console);
		this.corePath = corePath;
		this.processContainer = new RetroarchGameProcessContainer(this.path, this.corePath);
	}
}

async function getRetroarchPlaylistPaths(){

	const USER_DIR = env["HOME"];
	const PLAYLISTS_PATH = pathJoin(USER_DIR, ".config", "retroarch", "playlists");
	let playlists = await fsp.readdir(PLAYLISTS_PATH, {encoding: "utf-8", withFileTypes: true});
	playlists = playlists.filter(dirent=>dirent.isFile() && dirent.name.endsWith("lpl"));
	playlists = playlists.map(dirent=>pathJoin(PLAYLISTS_PATH, dirent.name));
	return playlists;
}

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