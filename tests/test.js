class Test{

	static STATE_THROW = 0;
	static STATE_SUCCESS = 1;
	static STATE_ANY = 2;

	/**
	 * Convert a state into a string
	 * @param {number} status - Status to convert
	 * @returns {string} - A string equivalent
	 */
	static statusToText(status){
		if (status === Test.STATE_THROW) return "throw";
		if (status === Test.STATE_SUCCESS) return "success";
		return "any";
	}

	/**
	 * Batch run tests and report on them
	 * @param {Test[]} tests - Array of tests
	 * @returns {boolean} True on full success, else false
	 */
	static batchRun(tests){

		// Run the tests
		let nPassing = 0;
		for (let i = 0; i < tests.length; i++){
			const isTestPassing = tests[i].run(true);
			nPassing += isTestPassing;
		}

		// General report
		const allPassing = nPassing === tests.length;
		if (allPassing){
			console.log(`✅ all ${tests.length} tests passing !`);
		} else {
			console.log(`❌ ${nPassing}/${tests.length} tests passing.`);
		}
		return allPassing;

	}

	/**
	 * Create a test
	 * @param {string} displayedName - Test's displayed name
	 * @param {function} f - Function to run
	 * @param {*[]} p - Parameters to pass
	 * @param {*} expectedResult - Expected resulting value
	 * @param {Number} expectedStatus - Expected ending status (Any, Throw, Failed)
	 */
	constructor(displayedName, f, p, expectedResult = undefined, expectedStatus = Test.STATE_ANY){
		this.displayedName = displayedName;
		this.f = f;
		this.p = p;
		this.expectedResult = expectedResult;
		this.expectedStatus = expectedStatus;
	}

	/**
	 * Run the test
	 * @param {boolean} doCompare - Whether to compare visually on fail
	 * @returns {boolean} - True on success, false on fail
	 */
	run(doCompare = true){

		let error = undefined;
		let result = undefined;
		let status = Test.STATE_SUCCESS;

		// Run the test
		try {
			result = this.f(...this.p);
		} catch (e){
			status = Test.STATE_THROW;
			error = e;
		}

		// Evaluate verdict
		const isStatusGood = (this.expectedStatus === Test.STATE_ANY) || (status === this.expectedStatus);
		const isResultGood = (result === this.expectedResult);
		const isGood = isStatusGood && isResultGood;

		// Inform via console
		if (!isGood){
			console.warn(`Test "${this.displayedName}" failed`);
		}
		if (doCompare){
			if (!isStatusGood){
				console.warn(`  Expected status : ${Test.statusToText(this.expectedStatus)}`);
				console.warn(`  Real status     : ${Test.statusToText(status)}`);
				if (typeof error !== "undefined"){
					console.warn(`  Message         : "${error}"`);
				}
			} else if (!isResultGood){
				console.warn(`    Expected result : ${this.expectedResult}`);
				console.warn(`    Real result     : ${result})`);
			}
		}

		// Pass verdict
		return isGood;

	}

}

module.exports = Test;