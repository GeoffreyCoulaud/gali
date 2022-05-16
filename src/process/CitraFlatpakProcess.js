const { NotImplementedError } = require("../NotImplementedError.js");
const { Process } = require("./Process.js");

class CitraFlatpakProcess extends Process{

	// TODO implement flatpak processes
	async start(){
		throw NotImplementedError("Starting flatpak Citra games is not yet supported");
	}
}

module.exports = {
	CitraFlatpakProcess
};