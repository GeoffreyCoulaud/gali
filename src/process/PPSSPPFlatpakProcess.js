const FlatpakProcess = require("./FlatpakProcess.js");

class PPSSPPFlatpakProcess extends FlatpakProcess {

	constructor (game) {
		super("org.ppsspp.PPSSPP");
		this.args.push(game.romPath);
	}

}

module.exports = PPSSPPFlatpakProcess;