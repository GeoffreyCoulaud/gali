export class Game{
	source = "Unknown";
	constructor(name){
		this.name = name;
	}
}

export class GameDir{
	constructor(path, recursive = false){
		this.path = path;
		this.recursive = recursive;
	}
}

export class SteamGame extends Game{
	source = "Steam";
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
	constructor(gameSlug, name, path, configPath = undefined){
		super(name);
		this.gameSlug = gameSlug;
		this.path = path;
		this.configPath = configPath;
	}
	toString(){
		return `"${this.name}" - ${this.source} - ${this.gameSlug}`;
	}
	toArray(){
		return [this.name, this.source, this.gameSlug, this.path];
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
		return `"${this.name}" - ${this.source} (${this.console})`;
	}
	toArray(){
		return [this.name, this.source, this.console, this.path];
	}
}

export class DolphinGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Dolphin", "Nintendo Wii / GameCube");
	}
}

export class YuzuGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Yuzu", "Nintendo Switch");
	}
}

export class CitraGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Citra", "Nintendo 3DS");
	}
}

export class CemuGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Cemu in Lutris", "Nintendo Wii U");
	}
}