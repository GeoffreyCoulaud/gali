const NotImplementedError = require("../NotImplementedError.js");
const Process = require("./Process.js");

class YuzuFlatpakProcess extends Process{

	// TODO implement flatpak processes
	async start(){
		throw NotImplementedError("Starting flatpak Yuzu games is not yet supported");
	}
}

module.exports = YuzuFlatpakProcess;