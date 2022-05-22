const FlatpakProcess = require("./FlatpakProcess.js");

class HeroicFlatpakProcess extends FlatpakProcess{

	isStoppable = false;
	isKillable = false;

	constructor (game) {
		super("com.heroicgameslauncher.hgl");
		this.args.push(`heroic://launch/${game.appName}`);
	}

}

module.exports = HeroicFlatpakProcess;