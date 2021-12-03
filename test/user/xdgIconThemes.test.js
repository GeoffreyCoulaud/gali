const xdg     = require("../../utils/xdg.js");
const cli     = require("./cli.js");
const process = require("process");

function help(){
	console.log(
		// eslint-disable-next-line indent
`Test that finds all the icon themes for the current user.
The theme keys, names and paths are displayed.`
	);
}

async function testGetIconThemes(){

	// CLI arguments
	if (cli.getPopBoolArgv("--help")){
		help();
		return;
	}

	// Get icon themes
	const iconThemes = await xdg.getIconThemes();

	// Display theme names and location
	const displayed = [];
	for (const theme of iconThemes){
		displayed.push({
			name : theme["Icon Theme"]["Name"],
			path: theme._path
		});
	}
	console.table(displayed);

}

testGetIconThemes().then(()=>{
	process.exit(0);
}).catch((error)=>{
	console.error(error);
	process.exit(1);
});