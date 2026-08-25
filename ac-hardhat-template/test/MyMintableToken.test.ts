import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { MyMintableToken } from "../typechain";

describe("MyMintableToken", function () {
  let token: MyMintableToken;

  before(async () => {
    token = await (await ethers.getContractFactory("MyMintableToken")).deploy();
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      expect(await token.name()).to.equal("MyMintableToken");
    });

    it("Should set the right symbol", async function () {
      expect(await token.symbol()).to.equal("MMT");
    });

    it("Should start with zero total supply", async function () {
      expect(await token.totalSupply()).to.equal(0n);
    });
  });

  describe("Mint", function () {
    it("Should mint to a recipient and update balance, total supply, and emit Transfer", async function () {
      const [deployer] = await ethers.getSigners();
      const amount = ethers.parseEther("1000");

      await expect(token.mint(deployer.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(ethers.ZeroAddress, deployer.address, amount);

      expect(await token.balanceOf(deployer.address)).to.equal(amount);
      expect(await token.totalSupply()).to.equal(amount);
    });

    it("Should accumulate balances across mints", async function () {
      const [deployer] = await ethers.getSigners();
      const amount = ethers.parseEther("500");
      await (await token.mint(deployer.address, amount)).wait();

      expect(await token.balanceOf(deployer.address)).to.equal(ethers.parseEther("1500"));
      expect(await token.totalSupply()).to.equal(ethers.parseEther("1500"));
    });

    it("Should reject minting from a non-owner", async function () {
      const [, other] = await ethers.getSigners();
      await expect(
        token.connect(other).mint(other.address, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });
});
