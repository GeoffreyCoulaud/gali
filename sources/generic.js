import { readdirAsync } from "readdir-enhanced";
import { join as pathJoin } from "path";
import { EventEmitter } from "events";

export class GameProcessContainer extends EventEmitter{
	process = undefined;
	isRunning = false;

	_bindProcessEvents(){
		this.process.on("spawn", ()=>{
			this.isRunning = true;
			this.emit("spawn");
		});
		this.process.on("error", (error)=>{
			this.isRunning = false;
			this.emit("error", error);
		});
		this.process.on("exit", (code, signal)=>{
			this.isRunning = false;
			this.emit("exit", code, signal);
		});
	}

	sendSignal(signal){
		// TODO kill all children before killing subprocess
		return this.process.kill(signal);		
	}
	
	kill(){
		if (!this.isRunning){ return; }
		const hasKilled = this.sendSignal("SIGKILL");
		if (hasKilled){
			this.isRunning = false;
		}
	}
	
	stop(){
		if (!this.isRunning){ return; }
		const hasStopped = this.sendSignal("SIGTERM");
		if (hasStopped){
			this.isRunning = false;
		}
	}

}

export class Game{
	source = "Unknown";
	
	subprocess = new GameProcessContainer();
	isRunning = false;
	
	constructor(name){
		this.name = name;
	}
}

export class GameDir {
	constructor(path, recursive = false) {
		this.path = path;
		this.recursive = recursive;
	}
}

export class EmulatedGame extends Game{
	constructor(name, path, source = "Unknown", console = "Unknown"){
		super(name);
		this.path = path;
		this.source = source;
		this.console = console;
	}
	toString(){
		return `${this.name} - ${this.source} (${this.console})`;
	}
}

export async function getROMs(dirs, filesRegex, warn = false){
	let paths = [];

	// Get roms
	for (let dir of dirs){
		
		// Get all the files in dir recursively
		let filePaths;
		try {
			filePaths = await readdirAsync(dir.path, {filter: filesRegex, deep: dir.recursive});
		} catch (error){
			if (warn) console.warn(`Skipping directory ${dir.path} (${error})`);
			continue;
		}

		// Filter to keep only game files
		if (filePaths.length === 0) console.warn(`No game files in "${dir.path}"${dir.recursive ? " (recursively)" : ""}`);

		// Add games
		for (let file of filePaths){
			let fileAbsPath = pathJoin(dir.path, file);
			paths.push(fileAbsPath);
		}

	}

	return paths;

}