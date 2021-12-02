const emulation = require("./emulation.js");

class SwitchEmulationGame extends emulation.EmulationGame{

	platform = "Nintendo - Switch";

}

class SwitchEmulationSource extends emulation.EmulationSource{}

module.exports = {
	SwitchEmulationSource,
	SwitchEmulationGame,
};