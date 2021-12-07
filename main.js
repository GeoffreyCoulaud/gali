const cli = require("./utils/cli.js");

// Choose which UI to load
const VALID_UI_CHOICES = ["gtk", "electron"];
const DEFAULT_UI = VALID_UI_CHOICES[0];
let uiChoice = cli.getPopValuesArgv("--ui", 1);
if (uiChoice.length === 0){
	uiChoice = DEFAULT_UI;
} else {
	uiChoice = uiChoice[0];
}
if (!VALID_UI_CHOICES.includes(uiChoice)){
	uiChoice = DEFAULT_UI;
}

// Load main.js for the selected UI
require(`${__dirname}/UI/${uiChoice}/main.js`);