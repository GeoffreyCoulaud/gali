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
	const DB_REQUEST_INSTALLED_GAMES = "SELECT name, slug, directory, configpath FROM 'games' WHERE installed = 1";
	const results = await db.all(DB_REQUEST_INSTALLED_GAMES);
	for (let row of results){
		// Validate every request row
		if (
			typeof row.slug !== "undefined" &&
			typeof row.name !== "undefined" &&
			typeof row.directory !== "undefined" &&
			typeof row.configpath !== "undefined"
		){
			games.push(new LutrisGame(row.slug, row.name, row.directory, row.configpath));
		}
	}

	return games;
}