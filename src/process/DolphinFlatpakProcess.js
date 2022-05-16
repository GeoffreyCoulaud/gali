const NotImplementedError = require("../NotImplementedError.js");
const Process = require("./Process.js");

class DolphinFlatpakProcess extends Process{

	// TODO implement flatpak processes
	async start(){
		throw NotImplementedError("Starting flatpak Dolphin games is not yet supported");
	}
}

module.exports = DolphinFlatpakProcess;