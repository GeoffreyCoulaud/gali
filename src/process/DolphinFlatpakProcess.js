const FlatpakProcess = require("./FlatpakProcess.js");

class DolphinFlatpakProcess extends FlatpakProcess{

	constructor (game) {
		super("org.DolphinEmu.dolphin-emu");
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

module.exports = DolphinFlatpakProcess;