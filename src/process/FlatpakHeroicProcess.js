const { NotImplementedError } = require("../NotImplementedError.js");
const { Process } = require("./Process.js");

class FlatpakHeroicProcess extends Process{

	// TODO implement flatpak processes
	async start(){
		throw NotImplementedError("Starting flatpak Heroic games is not yet supported");
	}
}

module.exports = {
	FlatpakHeroicProcess
};