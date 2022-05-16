const { NotImplementedError } = require("../NotImplementedError.js");
const { Process } = require("./Process.js");

class FlatpakRetroarchProcess extends Process{

	// TODO implement flatpak processes
	async start(){
		throw NotImplementedError("Starting flatpak Retroarch games is not yet supported");
	}
}

module.exports = {
	FlatpakRetroarchProcess
};