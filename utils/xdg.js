import { parse } from "shell-quote";

export function splitDesktopExec(exec){

	// Split, Remove field codes, return array
	const execFieldCodesRegex = /%[fFuUdDnNickvm]/g;
	const parsed = parse(exec);
	const arr = parsed.filter(arg=>!arg.match(execFieldCodesRegex));
	return arr;

}