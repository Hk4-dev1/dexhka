const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DexHKA", function () {
  let token1, token2, dex, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    // Deploy mock ERC20 tokens
    const ERC20 = await ethers.getContractFactory("MockERC20");
    token1 = await ERC20.deploy("Token1", "TK1", 1000000);
    token2 = await ERC20.deploy("Token2", "TK2", 1000000);
    await token1.deployed();
    await token2.deployed();
    // Deploy DexHKA
    const DexHKA = await ethers.getContractFactory("DexHKA");
    dex = await DexHKA.deploy(token1.address, token2.address);
    await dex.deployed();
    // Approve DEX to spend tokens
    await token1.approve(dex.address, 1000000);
    await token2.approve(dex.address, 1000000);
  });

  it("should add liquidity", async function () {
    await expect(dex.addLiquidity(1000, 2000))
      .to.emit(token1, "Transfer")
      .and.to.emit(token2, "Transfer");
    expect(await dex.reserve1()).to.equal(1000);
    expect(await dex.reserve2()).to.equal(2000);
  });

  it("should swap token1 to token2", async function () {
    await dex.addLiquidity(1000, 2000);
    await token1.transfer(addr1.address, 100);
    await token1.connect(addr1).approve(dex.address, 100);
    await expect(dex.connect(addr1).swap(token1.address, 100))
      .to.emit(token2, "Transfer");
  });

  it("should get price", async function () {
    await dex.addLiquidity(1000, 2000);
    const price = await dex.getPrice(100, token1.address);
    expect(price).to.be.above(0);
  });
});
