const { NotImplementedError } = require("../NotImplementedError.js");
const { Process } = require("./Process.js");

class SteamFlatpakProcess extends Process{

	// TODO implement flatpak processes
	async start(){
		throw NotImplementedError("Starting flatpak Steam games is not yet supported");
	}
}

module.exports = {
	SteamFlatpakProcess
};