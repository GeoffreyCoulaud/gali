const { NotImplementedError } = require("../NotImplementedError.js");
const { Process } = require("./Process.js");

class FlatpakPPSSPPProcess extends Process{

	// TODO implement flatpak processes
	async start(){
		throw NotImplementedError("Starting flatpak PPSSPP games is not yet supported");
	}
}

module.exports = {
	FlatpakPPSSPPProcess
};