const { wineToLinux: wtl, linuxToWine: ltw } = require("../utils/convertPathPlatform.js");
const process = require("process");
const Test = require("./test.js");

const tests = [
	
	// Tests that should succeed
	new Test(
		"Easy wine to linux (Z drive)",
		wtl, ["Z:\\dev\\null"], "/dev/null", Test.STATE_SUCCESS,
	),
	new Test(
		"Harder wine to linux (C drive)",
		wtl, ["C:\\testfile.txt", "/fakeprefix"], "/fakeprefix/dosdevices/c:/testfile.txt", Test.STATE_SUCCESS,
	),
	new Test(
		"Harder wine to linux (D drive)",
		wtl, ["D:\\testfile.txt", "/fakeprefix"], "/fakeprefix/dosdevices/d:/testfile.txt", Test.STATE_SUCCESS,
	),
	new Test(
		"Easy linux to wine (FS root)",
		ltw, ["/dev/null"], "Z:\\dev\\null", Test.STATE_SUCCESS,
	),

	// Tests that should throw
	new Test(
		"Non absolute linux to wine",
		ltw, ["./test.js"], undefined, Test.STATE_THROW,
	),
	new Test(
		"Non Z: wine to linux without prefix",
		ltw, ["C:\\testfile.txt"], undefined, Test.STATE_THROW, 
	),

];

// Run all the tests
const allGood = Test.batchRun(tests);
process.exit(allGood);