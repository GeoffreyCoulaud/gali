const testLibraryScan = require("./libraryScan.test.js");
const testGameStart = require("./gameStart.test.js");

// Run all tests
(async function(){
	console.log("--- Library scan ---");
	await testLibraryScan();
	
	console.log("\n--- Game start ---");
	await testGameStart();
})();