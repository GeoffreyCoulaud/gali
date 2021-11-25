const shell_quote = require("shell-quote");

function splitDesktopExec(exec){

	// Split, Remove field codes, return array
	const execFieldCodesRegex = /%[fFuUdDnNickvm]/g;
	const parsed = shell_quote.parse(exec);
	const arr = parsed.filter(arg=>!arg.match(execFieldCodesRegex));
	return arr;

}

module.exports = {
	splitDesktopExec,
};