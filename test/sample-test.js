const { expect } = require("chai");
const { BigNumber } = require("ethers");

const ALICE = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
describe("GameItem", function() {
  it("Should mint game item", async function() {
    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    
    await gameItem.deployed();
    const mintResult = (await gameItem.awardItem(ALICE, 'sampleUrl'))
    const itemId = mintResult.value.toNumber()
    console.log("itemId is:", itemId);
    expect(itemId).to.equal(0);

    const aliceBalance = await gameItem.balanceOf(ALICE)
    console.log("alice balance is:", aliceBalance.toNumber());

    const ownerOfItem0 = await gameItem.ownerOf(BigNumber.from(0))
    console.log("owner of item0 is:", ownerOfItem0);
    expect(ownerOfItem0).to.equal(ALICE)


    const tokenUri = await gameItem.tokenURI(BigNumber.from(0))
    console.log("token uri of item0 is:", tokenUri);
    expect(tokenUri).to.equal("sampleUrl")
  });
});
