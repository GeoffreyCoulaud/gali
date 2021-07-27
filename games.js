class Game{
	constructor(name){
		this.name = name;
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
		return `"${this.name}" - ${this.source} - ${this.appId}`;
	}
	toArray(){
		return [this.name, this.source, this.appId, this.steamLibraryFolder];
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
		return `"${this.name}" - ${this.source} - ${this.gameSlug}`;
	}
	toArray(){
		return [this.name, this.source, this.gameSlug, this.path];
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
		let string = `"${this.name}"`;
		if (typeof this.console !== "undefined"){
			string += ` (${this.console})`;
		}
		string += ` - ${this.source}`;
		return string;
	}
	toArray(){
		return [this.name, this.console, this.source, this.path];
	}
}

export class GameDir{
	constructor(path, recursive = false){
		this.path = path;
		this.recursive = recursive;
	}
}