/* eslint-disable no-undef */
const deepReaddir = require("../../utils/deepReaddir.js");
const expect = require("chai").expect;

const SAMPLE_DIR = `${__dirname}/readdirTestDir`;
function matchRoms(path){
	return path.endsWith(".rom");
}
const expected = {
	simplest: [
		`${__dirname}/readdirTestDir/sample.rom`,
		`${__dirname}/readdirTestDir/sample.txt`,
		`${__dirname}/readdirTestDir/d1/sample.rom`,
		`${__dirname}/readdirTestDir/d1/sample.txt`,
		`${__dirname}/readdirTestDir/d1/d2/sample.rom`,
		`${__dirname}/readdirTestDir/d1/d2/sample.txt`,
		`${__dirname}/readdirTestDir/d1/d2/d3/sample.rom`,
		`${__dirname}/readdirTestDir/d1/d2/d3/sample.txt`,
		`${__dirname}/readdirTestDir/d1/d2/d3/d4/sample.rom`,
		`${__dirname}/readdirTestDir/d1/d2/d3/d4/sample.txt`,
	],
	classic: [
		`${__dirname}/readdirTestDir/sample.rom`,
		`${__dirname}/readdirTestDir/sample.txt`,
	],
	limited: [
		`${__dirname}/readdirTestDir/sample.rom`,
		`${__dirname}/readdirTestDir/sample.txt`,
		`${__dirname}/readdirTestDir/d1/sample.rom`,
		`${__dirname}/readdirTestDir/d1/sample.txt`,
	],
	filtered: [
		`${__dirname}/readdirTestDir/sample.rom`,
		`${__dirname}/readdirTestDir/d1/sample.rom`,
		`${__dirname}/readdirTestDir/d1/d2/sample.rom`,
		`${__dirname}/readdirTestDir/d1/d2/d3/sample.rom`,
		`${__dirname}/readdirTestDir/d1/d2/d3/d4/sample.rom`,
	],
	limitedAndFiltered: [
		`${__dirname}/readdirTestDir/sample.rom`,
		`${__dirname}/readdirTestDir/d1/sample.rom`,
	],
};

describe("deepReaddir", function(){

	it("default should find all files in subdirectories", async function(){
		const p = await deepReaddir(SAMPLE_DIR);
		expect(p).to.deep.equal(expected.simplest);
	});

	it("depth 0 equals regular readdir", async function(){
		const p = await deepReaddir(SAMPLE_DIR, 0);
		expect(p).to.deep.equal(expected.classic);
	});

	it("depth N should find files in folders nested up to depth N", async function(){
		const p = await deepReaddir(SAMPLE_DIR, 1);
		expect(p).to.deep.equal(expected.limited);
	});

	it("files found should match the given function", async function(){
		const p = await deepReaddir(SAMPLE_DIR, Infinity, matchRoms);
		expect(p).to.deep.equal(expected.filtered);
	});

	it("files found should match the given function and be within given depth", async function(){
		const p = await deepReaddir(SAMPLE_DIR, 1, matchRoms);
		expect(p).to.deep.equal(expected.limitedAndFiltered);
	});

});