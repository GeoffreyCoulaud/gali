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

class EqCriteria extends Criteria{

	constructor(referenceValue){
		super();
		this.referenceValue = referenceValue;
	}

	test(value){
		return value === this.referenceValue;
	}

}

class InstCriteria extends Criteria{

	constructor(referenceClass){
		super();
		this.referenceClass = referenceClass;
	}

	test(obj){
		return obj instanceof this.referenceClass;
	}

}

class RegexCriteria extends Criteria{

	constructor(referenceRegex){
		super();
		this.referenceRegex = referenceRegex;
	}

	test(str){
		if (typeof str !== "string") return false;
		return this.referenceRegex.test(str);
	}

}

class PropCriteria extends Criteria{

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
 * To match, a game must fit all the PropCriterias of the dependency
 * and be an instance of the given class.
 * @property {class} klass - The class the game must be an instance of
 * @property {PropCriteria[]} criteras - Criteria for the game to match
 */
class Dependency{

	/**
	 * Create a new Dependency
	 * @param {class} klass - The class the game must be an instance of
	 * @param {PropCriteria[]} criterias - The PropCriterias to match for the dependency to be met
	 */
	constructor(klass, ...criterias){
		this.klass = klass;
		this.criterias = criterias;
	}

	/**
	 * Test if a game fulfils the dependency.
	 * @param {Game} game - The game to test
	 * @returns {boolean}
	 */
	test(game){
		if (!(game instanceof this.klass)) return false;
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

	const dep = new Dependency(
		new InstanceOfCriteria(LutrisGame),
		new PropertyMatchingCriteria(
			"name",
			new EqualityCriteria("cemu")
		)
	)

*/

module.exports = {
	Criteria,
	EqCriteria,
	InstCriteria,
	RegexCriteria,
	PropCriteria,
	Dependency,
};