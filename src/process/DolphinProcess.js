const Process = require("./Process.js");

class DolphinProcess extends Process {

	command = "dolphin-emu";

	constructor (game) {
		super();
		this.args.push("-e", game.romPath);
	}

	// TODO find a better way to start in specific modes
	/*
	async start(noUi = false) {
		if (noUi) this.args.unshift("-b");
		await super.start();
	}
	*/

}

module.exports = DolphinProcess;