const FlatpakProcess = require("./FlatpakProcess.js");

class YuzuFlatpakProcess extends FlatpakProcess {

	constructor (game) {
		super("org.yuzu_emu.yuzu");
		this.args.push(game.romPath);
	}

}

module.exports = YuzuFlatpakProcess;