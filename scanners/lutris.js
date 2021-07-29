import { LutrisGame } from "../games.js";
import { join as pathJoin } from "path";
import { open } from 'sqlite'
import { env } from "process";
import sqlite3 from 'sqlite3'

const USER_DIR = env["HOME"];
const LUTRIS_DB_PATH = pathJoin(USER_DIR, ".local", "share", "lutris", "pga.db");

export async function getLutrisInstalledGames(warn = false){
	let games = [];
	
	// Open DB
	let db;
	try {
		db = await open({filename: LUTRIS_DB_PATH, driver: sqlite3.cached.Database});
	} catch(error){
		if (warn) console.warn(`Could not open lutris DB (${error})`);
		return games;
	}

	// Get games
	const DB_REQUEST_INSTALLED_GAMES = "SELECT id, name, slug, directory FROM 'games' WHERE installed = 1";
	const results = await db.all(DB_REQUEST_INSTALLED_GAMES);
	for (let result of results){
		games.push(new LutrisGame(result?.slug, result?.name, result?.directory, result?.id));
	}

	return games;
}