const Process = require("./Process.js");

class FlatpakProcess extends Process{
	
	// TODO implement starting flatpaks
	async start(){
		console.warn("Starting flatpak processes is not yet supported");
		return;
	}

}

module.exports = FlatpakProcess;