const FlatpakProcess = require("./FlatpakProcess.js");

class CitraFlatpakProcess extends FlatpakProcess {

	constructor (game) {
		super("org.citra_emu.citra");
		this.args.push(game.path);
	}

}

module.exports = CitraFlatpakProcess;