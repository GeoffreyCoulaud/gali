/**
 * A class representing a class criteria for matching.
 * @abstract
 */
class Criteria{

	/**
	 * Test if a value matches the criteria
	 * @param {*} x - The value to test. Can be anything.
	 * @returns {boolean}
	 * @virtual
	 */
	test(x){
		return false;
	}

}

class EqualityCriteria extends Criteria{

	constructor(referenceValue){
		super();
		this.referenceValue = referenceValue;
	}

	test(value){
		return value === this.referenceValue;
	}

}

class InstanceOfCriteria extends Criteria{

	constructor(referenceClass){
		super();
		this.referenceClass = referenceClass;
	}

	test(obj){
		return obj instanceof this.referenceClass;
	}

}

class RegexMatchingCriteria extends Criteria{

	constructor(referenceRegex){
		super();
		this.referenceRegex = referenceRegex;
	}

	test(str){
		if (typeof str !== "string") return false;
		return this.referenceRegex.test(str);
	}

}

class PropertyMatchingCriteria extends Criteria{

	constructor(property, criteria){
		super();
		this.criteria = criteria;
		this.property = property;
	}

	test(obj){
		if (!(this.property in obj)) return false;
		return this.criteria.test(obj[this.property]);
	}

}

/**
 * A class representing a Source dependency.
 * To match, a game must fit all the criteria of the dependency.
 * @property {Criteria[]} criteras - Criteria for the game to match
 */
class SourceDependency{

	constructor(...criterias){
		this.criterias = criterias;
	}

	/**
	 * Test if a game fulfils the dependency. 
	 * @param {Game} game - The game to test
	 * @returns {boolean}
	 */
	test(game){
		for (const criteria of this.criterias){
			if (!criteria.test(game)) return false;
		}
		return true;
	}
}



/*
	* Expliciting that a Source depends on a game that :
	*	- Is instance of LutrisGame
	*   - Has a property "name" equal to "cemu"  

	const dep = new SourceDependency(
		new InstanceOfCriteria(LutrisGame),
		new PropertyMatchingCriteria(
			"name",
			new EqualityCriteria("cemu")
		) 
	)

*/

module.exports = {
	Criteria,
	EqualityCriteria,
	InstanceOfCriteria,
	RegexMatchingCriteria,
	PropertyMatchingCriteria,
	SourceDependency,
};