"use strict";

var _require = require("chai"),
    expect = _require.expect;

var _require2 = require("ethers"),
    BigNumber = _require2.BigNumber;

var ALICE = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
describe("GameItem", function () {
  it("Should mint game item", function _callee() {
    var GameItem, gameItem, mintResult, itemId, aliceBalance, ownerOfItem0, tokenUri;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(ethers.getContractFactory("GameItem"));

          case 2:
            GameItem = _context.sent;
            _context.next = 5;
            return regeneratorRuntime.awrap(GameItem.deploy());

          case 5:
            gameItem = _context.sent;
            _context.next = 8;
            return regeneratorRuntime.awrap(gameItem.deployed());

          case 8:
            _context.next = 10;
            return regeneratorRuntime.awrap(gameItem.awardItem(ALICE, 'sampleUrl'));

          case 10:
            mintResult = _context.sent;
            itemId = mintResult.value.toNumber();
            console.log("itemId is:", itemId);
            expect(itemId).to.equal(0);
            _context.next = 16;
            return regeneratorRuntime.awrap(gameItem.balanceOf(ALICE));

          case 16:
            aliceBalance = _context.sent;
            console.log("alice balance is:", aliceBalance.toNumber());
            _context.next = 20;
            return regeneratorRuntime.awrap(gameItem.ownerOf(BigNumber.from(0)));

          case 20:
            ownerOfItem0 = _context.sent;
            console.log("owner of item0 is:", ownerOfItem0);
            expect(ownerOfItem0).to.equal(ALICE);
            _context.next = 25;
            return regeneratorRuntime.awrap(gameItem.tokenURI(BigNumber.from(0)));

          case 25:
            tokenUri = _context.sent;
            console.log("token uri of item0 is:", tokenUri);
            expect(tokenUri).to.equal("sampleUrl");

          case 28:
          case "end":
            return _context.stop();
        }
      }
    });
  });
});