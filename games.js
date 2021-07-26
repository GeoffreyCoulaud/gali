class Game{
	constructor(name){
		this.name = name;
	}
	toString(){
		return `"${this.name}"`;
	}
}
export class SteamGame extends Game{
	source = "Steam"
	constructor(appId, name, steamLibraryFolder){
		super(name);
		this.appId = appId;
		this.steamLibraryFolder = steamLibraryFolder;
	}
	toString(){
		return `${this.source} - ${this.appId} - "${this.name}"`;
	}
}
export class LutrisGame extends Game{
	source = "Lutris";
	constructor(gameSlug, name, path, localId = undefined){
		super(name);
		this.gameSlug = gameSlug;
		this.path = path;
		this.localId = localId;
	}
	toString(){
		return `${this.source} - ${this.gameSlug} - "${this.name}"`;
	}
}
export class DolphinEmuGame extends Game{
	source = "Dolphin Emulator";
	constructor(name, path, console = undefined){
		super(name);
		this.path = path;
		this.console = console;
	}
	toString(){
		let string = `${this.source} - "${this.name}"`;
		if (typeof this.console !== "undefined"){
			string += ` ${this.console}`;
		}
		return string;
	}
}

export class GameDir{
	constructor(path, recursive = false){
		this.path = path;
		this.recursive = recursive;
	}
}