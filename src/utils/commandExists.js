const child_process = require("child_process");
const shell_quote = require("shell-quote");

function commandExists(commandName){
	return new Promise((resolve, reject)=>{
		const options = {timeout: 100};
		const safeCommandName = shell_quote.quote([commandName]);
		const execCommand = `command -v ${safeCommandName}`;
		const child = child_process.exec(execCommand, options);
		child.on("close", (code)=>{
			if (code === 0){
				resolve(true);
			} else {
				resolve(false);
			}
		});
		child.on("error", (err)=>{
			reject(err);
		});
	});
}

module.exports = commandExists;