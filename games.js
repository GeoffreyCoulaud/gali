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
	constructor(appId, name){
		super(name);
		this.appId = appId;
	}
	toString(){
		return `${this.name} - ${this.source} - ${this.appId}`;
	}
}

export class LutrisGame extends Game{
	source = "Lutris";
	constructor(gameSlug, name, prefixPath, configPath = undefined){
		super(name);
		this.gameSlug = gameSlug;
		this.prefixPath = prefixPath;
		this.configPath = configPath;
	}
	toString(){
		return `${this.name} - ${this.source} - ${this.gameSlug}`;
	}
}

export class LegendaryGame extends Game{
	source = "Legendary";
	constructor(appName, name){
		super(name);
		this.appName = appName;
	}
	toString(){
		return `${this.name} - ${this.source} - ${this.appName}`;
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

export class RetroarchGame extends EmulatedGame{
	constructor(name, romPath, corePath, console){
		super(name, romPath, "Retroarch", console);
		this.corePath = corePath;
	}
}

export class DolphinGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Dolphin", "Nintendo - Wii / GameCube");
	}
}

export class YuzuGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Yuzu", "Nintendo - Switch");
	}
}

export class CitraGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Citra", "Nintendo - 3DS");
	}
}

export class CemuGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Cemu in Lutris", "Nintendo - Wii U");
	}
}

export class PPSSPPGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "PPSSPP", "Sony - PlayStation Portable");
	}
}