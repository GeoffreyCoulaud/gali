import { join as pathJoin, basename as pathBasename, extname as pathExtname} from "path";
import { RetroarchGame } from "../games.js";
import { promises as fsp } from "fs";
import { env } from "process";

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
		
		const game = new RetroarchGame(entry.label, entry.path, entry.corePath, PLAYLIST_CONSOLE);
		if (!game.corePath || game.corePath === "DETECT"){
			game.corePath = PLAYLIST_DEFAULT_CORE_PATH;
		} 
		if (!game.name){
			game.name = pathBasename(game.path, pathExtname(game.path));
		}
		
		// Validate game data
		if (game.name && game.path && game.corePath && game.console){
			games.push(game);
		} 

	}
	return games;

}

export async function getRetroarchGames(warn){

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