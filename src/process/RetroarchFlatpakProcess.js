const FlatpakProcess = require("./FlatpakProcess.js");

class RetroarchFlatpakProcess extends FlatpakProcess {

	constructor (game) {
		super("org.libretro.RetroArch");
		this.args.push("--libretro", game.corePath, game.romPath);
	}

}

module.exports = RetroarchFlatpakProcess;