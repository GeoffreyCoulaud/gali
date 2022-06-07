const Process = require("./Process.js");

class FlatpakProcess extends Process{

	command = "flatpak";

	constructor (flatpakAppId) {
		super();
		this.args.push("run", flatpakAppId);
	}

}

module.exports = FlatpakProcess;