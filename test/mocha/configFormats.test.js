/* eslint-disable no-undef */
const configFormats = require("../../sources/utils/configFormats.js");
const expect = require("chai").expect;

const encodedText = "&quot;interesting&quot; text containing normal chars &amp; xml special chars like &lt;, &gt; or even &apos;";
const decodedText = "\"interesting\" text containing normal chars & xml special chars like <, > or even '";
const withoutSemicolon = "&quot&amp";

describe("configFormats", function(){
	describe("#xmlSpecialChars", function(){

		it("XML special chars codes \"&<>' should be decoded", function(){
			const result = configFormats.xmlDecodeSpecialChars(encodedText);
			expect(result).to.be.equal(decodedText);
		});

		it("XML special chars without a semicolon should be ignored", function(){
			const result = configFormats.xmlDecodeSpecialChars(withoutSemicolon);
			expect(result).to.be.equal(withoutSemicolon);
		});

	});
});