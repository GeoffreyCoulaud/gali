const FlatpakProcess = require("./FlatpakProcess.js");

class SteamFlatpakProcess extends FlatpakProcess {

	isStoppable = false;
	isKillable = false;

	constructor (game) {
		super("com.valvesoftware.Steam");
		this.args.push(`steam://rungameid/${game.appId}`);
	}

}

module.exports = SteamFlatpakProcess;