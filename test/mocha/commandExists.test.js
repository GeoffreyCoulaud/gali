/* eslint-disable no-undef */
const commandExists = require("../../sources/utils/commandExists.js");
const expect = require("chai").expect;

const commands = {
	builtin: "echo",
	inPath: "grep",
	fake: "yesterday-i-ate-tomato-pie", // Normally noone has made this a command...
};

describe("commandExists", function(){

	it(`${commands.builtin} command should exist (builtin)`, async function(){
		const result = await commandExists(commands.builtin);
		expect(result).to.be.equal(true);
	});

	it(`${commands.inPath} command should exist (in $PATH)`, async function(){
		const result = await commandExists(commands.inPath);
		expect(result).to.be.equal(true);
	});

	it(`${commands.fake} command shouldn't exist`, async function(){
		const result = await commandExists(commands.fake);
		expect(result).to.be.equal(false);
	});

});