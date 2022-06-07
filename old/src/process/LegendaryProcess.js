const Process = require("./Process.js");

class LegendaryProcess extends Process {

	command = "legendary";

	constructor (game) {
		super();
		this.args.push("launch", game.appName);
	}

}

module.exports = LegendaryProcess;