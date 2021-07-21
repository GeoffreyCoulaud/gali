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
	constructor(gameSlug, name, installDir, localId = undefined){
		super(name);
		this.gameSlug = gameSlug;
		this.installDir = installDir;
		this.localId = localId;
	}
	toString(){
		return `${this.source} - ${this.gameSlug} - "${this.name}"`;
	}
}