const xdg = require("../utils/xdg.js");

const Process = require("./Process.js");

class DesktopEntryProcess extends Process {

	constructor (game) {
		super();
		const splitExec = xdg.splitDesktopExec(game.exec);
		this.command = splitExec.shift();
		this.args.push(...splitExec);
	}

}

module.exports = DesktopEntryProcess;