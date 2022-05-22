const Process = require("./Process.js");

class CitraProcess extends Process {

	command = "citra-qt";

	constructor (game) {
		super();
		this.args.push(game.path);
	}

}

module.exports = CitraProcess;