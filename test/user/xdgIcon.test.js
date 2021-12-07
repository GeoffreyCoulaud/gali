const xdg     = require("../../utils/xdg.js");
const cli     = require("../../utils/cli.js");
const process = require("process");

function help(){
	console.log(
		// eslint-disable-next-line indent
`Test that tries to find a XDG icon path from its name and theme.

Usage
	node xdgIcon.test.js <theme_name> <icon_name> <icon_size> <icon_scale>`
	);
}

function testGetIcon(){
	return new Promise((resolve, reject)=>{

		// CLI arguments
		if (cli.getPopBoolArgv("--help")){
			help();
			resolve();
		}
		if (process.argv.length < 5){
			console.error("Not enough arguments. Use --help for usage.");
			reject(1);
		}
		const tname = process.argv[2];
		const iname  = process.argv[3];
		let size    = process.argv[4];
		let scale   = process.argv[5] ?? 1;

		// Parse numeric CLI args
		if (isNaN(size)){
			console.error("Size is not a number. Use --help for usage.");
			reject(1);
		}
		if (isNaN(scale)){
			console.error("Scale is not a number. Use --help for usage.");
			reject(1);
		}
		size = Number(size);
		scale = Number(scale);

		// Get icon themes, then icon
		xdg.getIconThemes()
			.then(themes=>{
				return xdg.getIcon(iname, size, scale, tname, themes);
			})
			.then(iconPath=>{
				if (!iconPath){
					console.error(`Icon ${iname} ${size}@${scale}x not found`);
					reject(2);
					return;
				} else {
					console.log(iconPath);
					resolve();
				}
			})
			.catch(error=>{
				console.error(error);
				reject(3);
			});
	});
}

testGetIcon().then(()=>{
	process.exit(0);
}).catch((code)=>{
	process.exit(code);
});