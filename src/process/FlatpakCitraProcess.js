const { NotImplementedError } = require("../NotImplementedError.js");
const { Process } = require("./Process.js");

class FlatpakCitraProcess extends Process{

	// TODO implement flatpak citra process
	async start(){
		throw NotImplementedError("Starting flatpak Citra games is not yet supported");
	}
}

module.exports = {
	FlatpakCitraProcess
};