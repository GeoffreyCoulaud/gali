const { NotImplementedError } = require("../NotImplementedError.js");
const { Process } = require("./Process.js");

class FlatpakDolphinProcess extends Process{

	// TODO implement flatpak processes
	async start(){
		throw NotImplementedError("Starting flatpak Dolphin games is not yet supported");
	}
}

module.exports = {
	FlatpakDolphinProcess
};