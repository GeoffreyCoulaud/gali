const Process = require("./Process.js");

class HeroicProcess extends Process {

	command = "xdg-open";

	isStoppable = false;
	isKillable = false;

	constructor (game) {
		super();
		this.args.push(`heroic://launch/${game.app_name}`);
	}

}

module.exports = HeroicProcess;