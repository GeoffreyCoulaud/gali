/* eslint-disable no-undef */
const conv   = require("../../sources/utils/convertPathPlatform.js");
const expect = require("chai").expect;

describe("convertPathPlatform", function(){

	describe("#wineToLinux", function(){

		it("should convert absolute wine paths to linux paths", function(){
			const p = conv.wineToLinux("Z:\\dev\\null");
			expect(p).to.equal("/dev/null");
		});

		it("should convert wine c drive paths to linux paths with a prefix", function(){
			const p = conv.wineToLinux("C:\\testfile.txt", "/fakeprefix");
			expect(p).to.equal("/fakeprefix/dosdevices/c:/testfile.txt");
		});

		it("should convert wine external drive paths to linux paths with a prefix", function(){
			const p = conv.wineToLinux("D:\\testfile.txt", "/fakeprefix");
			expect(p).to.equal("/fakeprefix/dosdevices/d:/testfile.txt");
		});

		it("should not convert wine external drive paths to linux without a prefix", function(){
			expect(function(){
				conv.wineToLinux("C:\\testfile.txt");
			}).to.throw();
		});

	});

	describe("#linuxToWine", function(){

		it("should convert asbolute linux paths to wine paths", function(){
			const p = conv.linuxToWine("/dev/null");
			expect(p).to.equal("Z:\\dev\\null");
		});

		it("should not convert relative linux paths to wine paths", function(){
			expect(function(){
				conv.linuxToWine("./test.js");
			}).to.throw();
		});

	});

});